package org.example.service;

import org.example.dto.ChampionMasteryDto;
import org.example.model.PlayerMastery;
import org.example.repository.MasteryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerMasteryService {

    private final MasteryRepository masteryRepository;
    private final RestClient restClient;
    private final String defaultPlatform;

    public PlayerMasteryService(
            MasteryRepository masteryRepository,
            RestClient.Builder restClientBuilder,
            @Value("${riot.api.key}") String apiKey,
            @Value("${riot.api.platform}") String defaultPlatform
    ) {
        this.masteryRepository = masteryRepository;
        this.defaultPlatform = defaultPlatform;
        this.restClient = restClientBuilder
                .defaultHeader("X-Riot-Token", apiKey)
                .build();
    }

    public PlayerMastery fetchAndSavePlayerMastery(String puuid) {
        // 1. Pobranie danych z Riot API z pełnym URL zawierającym domenę .api.riotgames.com
        List<ChampionMasteryDto> dtos = restClient.get()
                .uri("https://{platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}",
                        defaultPlatform, puuid)
                .retrieve()
                .body(new ParameterizedTypeReference<List<ChampionMasteryDto>>() {});

        // 2. Mapowanie na listę podobiektów ChampionMastery
        List<PlayerMastery.ChampionMastery> champions = (dtos == null || dtos.isEmpty())
                ? Collections.emptyList()
                : dtos.stream()
                .map(dto -> new PlayerMastery.ChampionMastery(
                        dto.championId(),
                        dto.championLvl(),
                        dto.championPoints()
                ))
                .toList();

        PlayerMastery playerMastery = new PlayerMastery(puuid, champions);

        // 3. Zapis do MongoDB i zwrotka
        return masteryRepository.save(playerMastery);
    }

    public Optional<PlayerMastery> getPlayerMastery(String puuid)
    {
        return masteryRepository.findById(puuid);
    }

    public List<PlayerMastery.ChampionMastery> getTop3Masteries(String puuid){
        return masteryRepository.findTop3MasteriesByPuuid(puuid)
                .map(PlayerMastery::champions)
                .orElseGet(() -> fetchAndSavePlayerMastery(puuid)
                        .champions()
                        .stream()
                        .limit(3)
                        .toList());
    }
}