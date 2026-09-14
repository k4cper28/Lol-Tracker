package org.example.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ChampionMasteryDto(
        int championId,
        @JsonProperty("championLevel") int championLvl,
        int championPoints
) {
}
