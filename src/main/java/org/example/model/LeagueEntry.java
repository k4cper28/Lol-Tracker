package org.example.model;

public record LeagueEntry(
        String queueType,
        String tier,
        String rank,
        int leaguePoints,
        int wins,
        int losses,
        boolean veteran,
        boolean inactive,
        boolean freshBlood,
        boolean hotStreak
) {
}
