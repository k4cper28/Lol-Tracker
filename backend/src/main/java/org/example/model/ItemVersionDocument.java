package org.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "game_items")
public record ItemVersionDocument(
        @Id
        String version,
        String patch,
        Map<String,SimpleItem> items
) {
    public record SimpleItem(
      String id,
      String name,
      String description,
      String img,
      int gold,
      Map<String, Double> stats
    ){}
}
