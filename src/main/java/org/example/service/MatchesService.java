package org.example.service;

import org.example.model.PlayerMatches;
import org.example.repository.MatchesRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class MatchesService {

    private final MatchesRepository matchesRepository;
    private final RestClient restClient;

    @Value("${riot.api.region}")
    private String defaultRegion;

    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    public MatchesService(
            MatchesRepository matchesRepository,
            @Value("${riot.api.key}") String apiKey
    ) {
        this.matchesRepository = matchesRepository;
        this.restClient = RestClient.builder()
                .defaultHeader("X-Riot-Token", apiKey)
                .build();
    }

    public PlayerMatches getOrFetchPlayerMatches(String puuid, int count) {
        Optional<PlayerMatches> existingRecordOpt = matchesRepository.findById(puuid);

        // Sprawdzenie świeżości cache'u (czy minęło mniej niż 30 minut)
        if (existingRecordOpt.isPresent()) {
            PlayerMatches cached = existingRecordOpt.get();
            if (cached.updatedAt() != null &&
                    Duration.between(cached.updatedAt(), LocalDateTime.now()).compareTo(CACHE_TTL) < 0) {
                return cached;
            }
        }

        return fetchAndSaveMatchesIds(puuid, count, existingRecordOpt.orElse(null));
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

    public PlayerMatches getMatchesFromDb(String puuid) {
        return matchesRepository.findById(puuid)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono meczów w bazie dla danego użytkownika: " + puuid));
    }
}