package org.example.util;

import org.example.model.LeagueEntry;
import java.util.Map;

public final class RankEvaluator {

    private RankEvaluator() {
    }

    private static final Map<String, Integer> TIER_SCORES = Map.of(
            "IRON", 1,
            "BRONZE", 2,
            "SILVER", 3,
            "GOLD", 4,
            "PLATINUM", 5,
            "EMERALD", 6,
            "DIAMOND", 7,
            "MASTER", 8,
            "GRANDMASTER", 9,
            "CHALLENGER", 10
    );

    private static final Map<String, Integer> DIVISION_SCORES = Map.of(
            "IV", 1,
            "III", 2,
            "II", 3,
            "I", 4
    );

    /**
     * Oblicza bezwzględną wartość liczbową rangi.
     * Wzór: Tier * 10 000 + Dywizja * 1 000 + Punkty LP
     */
    public static int calculateScore(LeagueEntry rank) {
        if (rank == null || rank.tier() == null) {
            return 0;
        }

        int tierWeight = TIER_SCORES.getOrDefault(rank.tier().toUpperCase(), 0) * 10_000;

        // Master, Grandmaster i Challenger nie mają dywizji (rank jest pusty lub "I")
        int divisionWeight = rank.rank() != null
                ? DIVISION_SCORES.getOrDefault(rank.rank().toUpperCase(), 0) * 1_000
                : 0;

        int lp = Math.max(0, rank.leaguePoints());

        return tierWeight + divisionWeight + lp;
    }

    /**
     * Zwraca true, jeśli ranga 'current' jest wyższa niż 'previousBest'.
     */
    public static boolean isHigher(LeagueEntry current, LeagueEntry previousBest) {
        if (current == null) {
            return false;
        }
        if (previousBest == null) {
            return true;
        }
        return calculateScore(current) > calculateScore(previousBest);
    }
}