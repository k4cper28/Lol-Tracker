package org.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "players")
public record PlayerProfile(
    @Id
    String puuid,
    @Indexed
    String gameName,

    String tagLine,
    int summonerLevel,
    int profileIcon,
    String iconUrl,
    Map<String,LeagueEntry> ranks,
    LocalDateTime updatedAt
    ){}
