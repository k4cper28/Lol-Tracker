package org.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "matchesDetails")
public record MatchesDetails(
        @Id
        String matchId,
        Map<String,Object> metadata,
        Map<String,Object> info
) {
}
