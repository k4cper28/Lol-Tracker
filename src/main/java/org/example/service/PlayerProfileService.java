package org.example.service;

import org.example.model.LeagueEntry;
import org.example.model.PlayerProfile;
import org.example.dto.RiotDtos.AccountDto;
import org.example.dto.RiotDtos.SummonerDto;
import org.example.dto.RiotDtos.LeagueEntryDto;
import org.example.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PlayerProfileService {

    private final PlayerRepository playerRepository;
    private final RestClient restClient;

    @Value("${riot.api.region}")
    private String defaultRegion;

    @Value("${riot.api.platform}")
    private String defaultPlatform;

    @Value("${riot.api.ddragon-version}")
    private String ddragonVersion;

    // Czas ważności cache'u - np. 30 minut
    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    public PlayerProfileService(
            PlayerRepository playerRepository,
            @Value("${riot.api.key}") String apiKey){
        this.playerRepository = playerRepository;

        this.restClient = RestClient.builder()
                .defaultHeader("X-Riot-Token", apiKey)
                .build();
    }

    public PlayerProfile getPlayerProfile(String gameName, String tagLine) {
        // 1. czy gracz istnieje w naszej bazie MongoDB
        return playerRepository.findByGameNameIgnoreCaseAndTagLineIgnoreCase(gameName, tagLine)
                .map(this::refreshIfExpired)
                .orElseGet(() -> fetchAndSaveFromRiot(gameName, tagLine));
    }

    private PlayerProfile refreshIfExpired(PlayerProfile profile) {
        // 2. Jeśli dane w bazie są świeższe niż 30 minut, zwróć je bez odpytywania Riotu
        if(profile.updatedAt() != null &&
            profile.updatedAt().isAfter(LocalDateTime.now().minus(CACHE_TTL))) {
            return profile;
        }

        return fetchAndSaveFromRiot(profile.gameName(), profile.tagLine());
    }

    private PlayerProfile fetchAndSaveFromRiot(String gameName, String tagLine) {
        String encodedName = UriUtils.encode(gameName, StandardCharsets.UTF_8);
        String encodedTag = UriUtils.encode(tagLine, StandardCharsets.UTF_8);

        // KROK A: Pobierz PUUID z klastra regionalnego (europe)
        AccountDto account = restClient.get()
                .uri("https://{region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}",
                        defaultRegion, encodedName, encodedTag)
                .retrieve()
                .body(AccountDto.class);

        if (account == null || account.puuid() == null) {
            throw new RuntimeException("Nie znaleziono gracza o podanym Riot ID w Riot API");
        }

        // KROK B: Pobierz Level i Ikonę z serwera platformowego (eun1)
        SummonerDto summoner = restClient.get()
                .uri("https://{platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}",
                        defaultPlatform, account.puuid())
                .retrieve()
                .body(SummonerDto.class);

        if (summoner == null) {
            throw new RuntimeException("Nie udało się pobrać danych przywoływacza dla PUUID: " + account.puuid());
        }

        // KROK C: Zbuduj gotowy link do grafiki ikony z CDN Data Dragon
        String iconUrl = String.format("https://ddragon.leagueoflegends.com/cdn/%s/img/profileicon/%d.png",
                ddragonVersion, summoner.profileIconId());

        // Pobranie danych z Riot LEAGUE-V4
        List<LeagueEntryDto> leagueEntries = restClient.get()
                .uri("https://{platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/{puuid}",
                        defaultPlatform, account.puuid())
                .retrieve()
                .body(new ParameterizedTypeReference<List<LeagueEntryDto>>() {});

        // Mapowanie na Map<String, LeagueEntry>
        Map<String, LeagueEntry> ranksMap = (leagueEntries == null || leagueEntries.isEmpty())
                ? Collections.emptyMap()
                : leagueEntries.stream()
                .collect(Collectors.toMap(
                        LeagueEntryDto::queueType,
                        dto -> new LeagueEntry(
                                dto.queueType(),
                                dto.tier(),
                                dto.rank(),
                                dto.leaguePoints(),
                                dto.wins(),
                                dto.losses(),
                                dto.veteran(),
                                dto.inactive(),
                                dto.freshBlood(),
                                dto.hotStreak()
                        )
                ));

        // KROK D: Stwórz obiekt domenowy
        PlayerProfile profileToSave = new PlayerProfile(
                account.puuid(),
                account.gameName(),
                account.tagLine(),
                summoner.summonerLevel(),
                summoner.profileIconId(),
                iconUrl,
                ranksMap,
                LocalDateTime.now()
        );

        // KROK E: Zapisz/Zaktualizuj w MongoDB i zwróć
        return playerRepository.save(profileToSave);
    }

    public String getPuuidFromDatabase(String gameName, String tagLine){
        return playerRepository.findByGameNameIgnoreCaseAndTagLineIgnoreCase(gameName, tagLine)
                .map(PlayerProfile::puuid)
                .orElseThrow(() -> new RuntimeException("Gracz " + gameName + "#" + tagLine + " nie istnieje w bazie danych"));

    }
}
