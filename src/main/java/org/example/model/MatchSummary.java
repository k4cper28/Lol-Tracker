package org.example.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "matchSummary")
public record MatchSummary(
        @Id
        String matchId,
        long gameDuration,
        long gameEndTimestamp,
        String gameVersion,
        String platformId,
        int queueId,
        int mapId,
        List<ParticipantStats> participants
) {
    public record ParticipantStats(
        String puuid,
        String gameName,
        String tagLine,
        String championName,
        String position,
        int teamId,
        int championId,
        int level,
        int kills,
        int deaths,
        int assists,
        double kda,
        int visionScore,
        int wardPlaced,
        int gold,
        List<Integer> items,
        int questId,
        int totalChampionDmg,
        int apDmg,
        int physicalDmg,
        int totalDmg,
        int totalApDmg,
        int totalPhysicalDmg,
        int cs,
        int naturalMinionsKilled,
        int turretKills,
        int healedDmg,
        int getDmg,
        boolean firstBlood,
        boolean firstTower,
        boolean win
    )
    {}

}
