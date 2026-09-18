package org.example.service;

import org.example.model.ItemVersionDocument;
import org.example.repository.ItemVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ItemConsumer {
    @Autowired
    private ItemVersionRepository itemVersionRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @KafkaListener(topics = "ddragon-version-sync", groupId = "ddragon-items-group")
    public void ConsumeItemsSync(String patch) {
        System.out.println("<- [ItemsConsumer] Odebrano event dla patcha: " + patch);
        if (itemVersionRepository.existsByPatch(patch)) {
            System.out.println("-> [ItemsConsumer] Patch " + patch + " już istnieje w bazie. Pomijam.");
            return;
        }

        try {
            String[] versions = restTemplate.getForObject(
                    "https://ddragon.leagueoflegends.com/api/versions.json",
                    String[].class
            );

            if (versions == null || versions.length == 0) {
                System.err.println("-> [ItemsConsumer] Nie udało się pobrać versions.json");
                return;
            }

            String exactVersion = versions[0];
            for (String v : versions) {
                if (v.startsWith(patch + ".")) {
                    exactVersion = v;
                    break;
                }
            }

            String url = "https://ddragon.leagueoflegends.com/cdn/" + exactVersion + "/data/en_US/item.json";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !response.containsKey("data")) {
                System.err.println("-> [ItemsConsumer] Pusta odpowiedź z " + url);
                return;
            }

            Map<String, Object> rawData = (Map<String, Object>) response.get("data");
            Map<String, ItemVersionDocument.SimpleItem> parsedItems = new HashMap<>();


            for (Map.Entry<String, Object> entry : rawData.entrySet()) {
                String itemId = entry.getKey();
                Map<String, Object> itemMap = (Map<String, Object>) entry.getValue();

                String name = (String) itemMap.getOrDefault("name", "");
                String description = (String) itemMap.getOrDefault("description", "");


                Map<String, Object> imageMap = (Map<String, Object>) itemMap.get("image");
                String img = imageMap != null ? (String) imageMap.getOrDefault("full", itemId + ".png") : itemId + ".png";


                Map<String, Object> goldMap = (Map<String, Object>) itemMap.get("gold");
                int totalGold = goldMap != null ? ((Number) goldMap.getOrDefault("total", 0)).intValue() : 0;


                Map<String, Object> rawStats = (Map<String, Object>) itemMap.get("stats");
                Map<String, Double> parsedStats = new HashMap<>();
                if (rawStats != null) {
                    for (Map.Entry<String, Object> statEntry : rawStats.entrySet()) {
                        if (statEntry.getValue() instanceof Number n) {
                            parsedStats.put(statEntry.getKey(), n.doubleValue());
                        }
                    }
                }

                parsedItems.put(itemId, new ItemVersionDocument.SimpleItem(
                        itemId,
                        name,
                        description,
                        img,
                        totalGold,
                        parsedStats
                ));
            }
            ItemVersionDocument document = new ItemVersionDocument(exactVersion, patch, parsedItems);
            itemVersionRepository.save(document);
            System.out.println("-> [ItemsConsumer] Zapisano " + parsedItems.size() + " itemów dla wersji: " + exactVersion);
        } catch (Exception e) {
            System.err.println("-> [ItemsConsumer] Błąd podczas przetwarzania: " + e.getMessage());
        }
    }
}

