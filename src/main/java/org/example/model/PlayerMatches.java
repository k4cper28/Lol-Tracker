package org.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "playerMatches")
public record PlayerMatches(
        @Id
        String puuid,
        List<String> matchIds,
        LocalDateTime updatedAt
) {
}
