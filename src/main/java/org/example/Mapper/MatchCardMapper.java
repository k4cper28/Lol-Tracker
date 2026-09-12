package org.example.Mapper;

import org.example.dto.MatchCardDto;
import org.example.model.MatchSummary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchCardMapper {

    public MatchCardDto toCardDto(MatchSummary match, String targetPuuid) {
        MatchSummary.ParticipantStats me = match.participants().stream()
                .filter(p -> p.puuid().equals(targetPuuid))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Player not in match"));

        List<MatchCardDto.SimpleParticipantDto> simpleParticipants = match.participants().stream()
                .map(p -> new MatchCardDto.SimpleParticipantDto(
                        p.puuid(),
                        p.gameName(),
                        p.tagLine(),
                        p.championName(),
                        p.championId(),
                        p.teamId()
                ))
                .toList();

        int primaryRuneId = 0;
        int secondaryStyleId = 0;

        if (me.perks() != null) {
            if (me.perks().primaryPerks() != null && !me.perks().primaryPerks().isEmpty()) {
                primaryRuneId = me.perks().primaryPerks().get(0);
            }
            secondaryStyleId = me.perks().subStyleId();
        }

        return new MatchCardDto(
                match.matchId(),
                match.queueId(),
                match.gameDuration(),
                match.gameEndTimestamp(),
                me.win(),
                me.championName(),
                me.championId(),
                primaryRuneId,
                secondaryStyleId,
                me.kills(),
                me.deaths(),
                me.assists(),
                me.kda(),
                me.cs(),
                me.visionScore(),
                me.items(),
                simpleParticipants
        );
    }
}