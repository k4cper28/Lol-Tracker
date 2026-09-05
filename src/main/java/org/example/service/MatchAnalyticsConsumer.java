package org.example.service;


import org.apache.kafka.common.protocol.types.Field;
import org.example.model.MatchSummary;
import org.example.model.MatchesDetails;
import org.example.repository.MatchDetailsRepository;
import org.example.repository.MatchSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.ArrayList;
import java.util.List;


@Service
public class MatchAnalyticsConsumer {

    @Autowired
    private MatchDetailsRepository matchDetailsRepository;

    @Autowired
    private MatchSummaryRepository matchSummaryRepository;


    @KafkaListener(topics = "match-saved-events", groupId = "lol-analytics-group")
    public void handleNewMatch(String matchId){
        System.out.println("<- Konsument odebrał ID meczu z Kafki: " + matchId);

        if (matchSummaryRepository.existsById(matchId)) {
            return;
        }

        MatchesDetails rawMatch = matchDetailsRepository.findById(matchId).orElse(null);
        if (rawMatch == null || rawMatch.info() == null) {
            return;
        }

        Map<String, Object> info = rawMatch.info();

        int queueId = getInt(info, "queueId");
        long gameDuration = getLong(info, "gameDuration");
        long gameEndTimestamp = getLong(info, "gameEndTimestamp");
        String gameVersion = getString(info, "gameVersion");
        String platformId = getString(info, "platformId");
        int mapId = getInt(info,"mapId");

        List<Map<String, Object>> rawParticipants = (List<Map<String, Object>>) info.get("participants");
        List<MatchSummary.ParticipantStats> participants = new ArrayList<>();

        if (rawParticipants != null) {
            for (Map<String, Object> p : rawParticipants) {

                int kills = getInt(p, "kills");
                int deaths = getInt(p, "deaths");
                int assists = getInt(p, "assists");

                double kda = (deaths == 0)
                        ? (kills + assists)
                        : Math.round(((double) (kills + assists) / deaths) * 100.0) / 100.0;

                List<Integer> items = List.of(
                        getInt(p, "item0"),
                        getInt(p, "item1"),
                        getInt(p, "item2"),
                        getInt(p, "item3"),
                        getInt(p, "item4"),
                        getInt(p, "item5"),
                        getInt(p, "item6")
                );

                int cs = getInt(p, "totalMinionsKilled") + getInt(p, "neutralMinionsKilled");

                MatchSummary.PlayerRunes playerRunes = extractRunes(p);

                MatchSummary.ParticipantStats stats = new MatchSummary.ParticipantStats(
                        getString(p, "puuid"),
                        getString(p, "riotIdGameName"),
                        getString(p, "riotIdTagline"),
                        getString(p, "championName"),
                        getString(p, "teamPosition"),
                        getInt(p, "teamId"),
                        getInt(p, "championId"),
                        getInt(p, "champLevel"),
                        kills,
                        deaths,
                        assists,
                        kda,
                        getInt(p, "visionScore"),
                        getInt(p, "wardsPlaced"),
                        getInt(p, "goldEarned"),
                        items,
                        getInt(p,"roleBoundItem"),
                        getInt(p, "totalDamageDealtToChampions"),
                        getInt(p, "magicDamageDealtToChampions"),
                        getInt(p, "physicalDamageDealtToChampions"),
                        getInt(p, "totalDamageDealt"),
                        getInt(p, "magicDamageDealt"),
                        getInt(p, "physicalDamageDealt"),
                        cs,
                        getInt(p, "neutralMinionsKilled"),
                        getInt(p, "turretKills"),
                        getInt(p, "totalHeal"),
                        getInt(p, "totalDamageTaken"),
                        getBoolean(p, "firstBloodKill"),
                        getBoolean(p, "firstTowerKill"),
                        getBoolean(p, "win"),
                        playerRunes
                );

                participants.add(stats);
            }
        }

        MatchSummary summary = new MatchSummary(
                matchId,
                gameDuration,
                gameEndTimestamp,
                gameVersion,
                platformId,
                queueId,
                mapId,
                participants
        );

        matchSummaryRepository.save(summary);
        System.out.println("-> Zapisano MatchSummary dla meczu: " + matchId);



    }

    private int getInt(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return (val instanceof Number n) ? n.intValue() : 0;
    }

    private long getLong(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return (val instanceof Number n) ? n.longValue() : 0L;
    }

    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString().trim() : "";
    }

    private boolean getBoolean(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return Boolean.TRUE.equals(val);
    }

    @SuppressWarnings("unchecked")
    private MatchSummary.PlayerRunes extractRunes(Map<String, Object> participantMap) {
        Object rawPerks = participantMap.get("perks");
        if (!(rawPerks instanceof Map<?, ?> perksMapRaw)) {
            return new MatchSummary.PlayerRunes(0, 0, List.of(), List.of(), List.of());
        }

        Map<String, Object> perks = (Map<String, Object>) perksMapRaw;

        List<Integer> startPerks = new ArrayList<>();
        Object rawStatPerks = perks.get("statPerks");
        if (rawStatPerks instanceof Map<?, ?> statMapRaw) {
            Map<String, Object> statMap = (Map<String, Object>) statMapRaw;
            startPerks.add(getInt(statMap, "offense"));
            startPerks.add(getInt(statMap, "flex"));
            startPerks.add(getInt(statMap, "defense"));
        }


        int primaryStyleId = 0;
        int subStyleId = 0;
        List<Integer> primaryPerks = new ArrayList<>();
        List<Integer> subPerks = new ArrayList<>();

        Object rawStyles = perks.get("styles");
        if (rawStyles instanceof List<?> stylesListRaw) {
            List<Map<String, Object>> stylesList = (List<Map<String, Object>>) stylesListRaw;

            for (Map<String, Object> styleEntry : stylesList) {
                String desc = getString(styleEntry, "description");
                int styleId = getInt(styleEntry, "style");

                List<Integer> perkIds = new ArrayList<>();
                Object rawSelections = styleEntry.get("selections");
                if (rawSelections instanceof List<?> selectionsRaw) {
                    for (Object selObj : (List<?>) selectionsRaw) {
                        if (selObj instanceof Map<?, ?> selMap) {
                            perkIds.add(getInt((Map<String, Object>) selMap, "perk"));
                        }
                    }
                }

                if ("primaryStyle".equalsIgnoreCase(desc)) {
                    primaryStyleId = styleId;
                    primaryPerks = perkIds;
                } else if ("subStyle".equalsIgnoreCase(desc)) {
                    subStyleId = styleId;
                    subPerks = perkIds;
                }
            }
        }

        return new MatchSummary.PlayerRunes(
                primaryStyleId,
                subStyleId,
                primaryPerks,
                subPerks,
                startPerks
        );
    }
}
