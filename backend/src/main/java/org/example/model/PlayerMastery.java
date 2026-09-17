package org.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "player_masteries")
public record PlayerMastery(
        @Id
        String puuid,
        List<ChampionMastery> champions
) {
    public record ChampionMastery(
            int championId,
            int championLevel,
            int championPoints
    ){
    }
}
