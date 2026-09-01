package org.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public class RiotDtos {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AccountDto(
            String puuid,
            String gameName,
            String tagLine
    ){}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SummonerDto(
            String id,
            String puuid,
            int profileIconId,
            int summonerLevel
    ){}

}
