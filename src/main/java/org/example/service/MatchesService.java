package org.example.service;

import org.example.model.MatchesDetails;
import org.example.model.PlayerMatches;
import org.example.repository.MatchDetailsRepository;
import org.example.repository.MatchesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchesService {

    private final MatchesRepository matchesRepository;
    private final MatchDetailsRepository matchDetailsRepository;
    private final RestClient restClient;

    @Value("${riot.api.region}")
    private String defaultRegion;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;



    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    public MatchesService(
            MatchesRepository matchesRepository,
            MatchDetailsRepository matchDetailsRepository,
            @Value("${riot.api.key}") String apiKey
    ) {
        this.matchesRepository = matchesRepository;
        this.matchDetailsRepository = matchDetailsRepository;
        this.restClient = RestClient.builder()
                .defaultHeader("X-Riot-Token", apiKey)
                .build();
    }

    public PlayerMatches getOrFetchPlayerMatches(String puuid, int count, boolean force) {
        Optional<PlayerMatches> existing = matchesRepository.findById(puuid);

        if (!force && existing.isPresent()) {
            PlayerMatches cached = existing.get();
            if (cached.updatedAt() != null &&
                    Duration.between(cached.updatedAt(), LocalDateTime.now()).compareTo(CACHE_TTL) < 0) {
                return cached;
            }
        }

        return fetchAndSaveMatchesIds(puuid, count, existing.orElse(null));
    }

    private PlayerMatches fetchAndSaveMatchesIds(String puuid, int count, PlayerMatches currentRecord) {
        List<String> fetchedIds = restClient.get()
                .uri("https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={count}",
                        defaultRegion, puuid, count)
                .retrieve()
                .body(new ParameterizedTypeReference<List<String>>() {});

        if (fetchedIds == null) {
            fetchedIds = List.of();
        }

        Set<String> combinedIds = new LinkedHashSet<>(fetchedIds);
        if (currentRecord != null && currentRecord.matchIds() != null) {
            combinedIds.addAll(currentRecord.matchIds());
        }

        PlayerMatches updatedRecord = new PlayerMatches(
                puuid,
                new ArrayList<>(combinedIds),
                LocalDateTime.now()
        );

        return matchesRepository.save(updatedRecord);
    }

    public List<MatchesDetails> getOrFetchPlayerMatchesWithDetails(String puuid, int count, boolean force){

        PlayerMatches playerMatches = getOrFetchPlayerMatches(puuid, count, force);
        List<String> targetIds = playerMatches.matchIds().stream().limit(count).toList();

        List<MatchesDetails> cachedMatches = matchDetailsRepository.findByMatchIdIn(targetIds);
        Set<String> cachedIds = cachedMatches.stream()
                .map(MatchesDetails::matchId)
                .collect(Collectors.toSet());

        List<String> missingIds = targetIds.stream()
                .filter(id -> !cachedIds.contains(id))
                .toList();

        List<MatchesDetails> newlyFetched = new ArrayList<>();
        for (String matchId : missingIds) {
            try {
                // Mała pauza (50ms), żeby nie uderzyć w limit 20 req/s przy pobieraniu 20 gier na raz
                Thread.sleep(50);

                Map<String, Object> rawMatch = restClient.get()
                        .uri("https://{region}.api.riotgames.com/lol/match/v5/matches/{matchId}", defaultRegion, matchId)
                        .retrieve()
                        .body(new ParameterizedTypeReference<Map<String, Object>>() {});

                if (rawMatch != null) {
                    Map<String, Object> metadata = (Map<String, Object>) rawMatch.get("metadata");
                    Map<String, Object> info = (Map<String, Object>) rawMatch.get("info");

                    newlyFetched.add(new MatchesDetails(matchId, metadata, info));
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                System.err.println("Błąd pobierania meczu " + matchId + ": " + e.getMessage());
            }
        }

        // 5. Zapisanie nowych gier hurtowo do MongoDB
        if (!newlyFetched.isEmpty()) {
            matchDetailsRepository.saveAll(newlyFetched);
            for (MatchesDetails match : newlyFetched) {
                kafkaTemplate.send("match-saved-events", match.matchId());
                System.out.println("-> Wysłano do Kafki zdarzenie dla meczu: " + match.matchId());
            }
        }

        // 6. Połączenie wyników i posortowanie w kolejności wejściowej
        List<MatchesDetails> all = new ArrayList<>(cachedMatches);
        all.addAll(newlyFetched);

        Map<String, Integer> order = new HashMap<>();
        for (int i = 0; i < targetIds.size(); i++) {
            order.put(targetIds.get(i), i);
        }
        all.sort(Comparator.comparingInt(m -> order.getOrDefault(m.matchId(), Integer.MAX_VALUE)));

        return all;
    }

    public PlayerMatches getMatchesFromDb(String puuid) {
        return matchesRepository.findById(puuid)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono meczów w bazie dla danego użytkownika: " + puuid));
    }
}