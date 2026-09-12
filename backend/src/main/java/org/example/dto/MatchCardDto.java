package org.example.dto;
import java.util.List;

public record MatchCardDto(
        String matchId,
        int queueId,
        long gameDuration,
        long gameEndTimestamp,
        boolean win,

        String championName,
        int championId,
        int primaryStyleId,
        int subStyleId,

        int kills,
        int deaths,
        int assists,
        double kda,
        int cs,
        int visionScore,

        List<Integer> items,

        List<SimpleParticipantDto> participants

) {
    public record SimpleParticipantDto(
            String puuid,
            String gameName,
            String tagLine,
            String championName,
            int championId,
            int teamId
    ) {}
}
