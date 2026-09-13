package org.example.model;

import org.springframework.data.annotation.Id;

import java.util.List;

public record PlayerMastery(
        @Id
        String puuid,
        List<ChampionMastery> champions
) {
    public record ChampionMastery(
            @Id
            int championId,
            int championLvl,
            int championPoints
    ){

    }
}
