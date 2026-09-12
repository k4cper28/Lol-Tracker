package org.example.controller;

import org.example.model.LeagueEntry;
import org.example.model.PlayerProfile;
import org.example.service.PlayerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/players")
public class PlayerProfileController {
    private final PlayerProfileService playerProfileService;

    // Wstrzyknięcie serwisu przez konstruktor
    public PlayerProfileController(PlayerProfileService playerProfileService) {
        this.playerProfileService = playerProfileService;
    }
    // Endpoint: GET /api/players/{gameName}/{tagLine}
    @GetMapping("/{gameName}/{tagLine}")
    public ResponseEntity<PlayerProfile> getPlayerProfile(
            @PathVariable String gameName,
            @PathVariable String tagLine) {

        PlayerProfile profile = playerProfileService.getPlayerProfile(gameName, tagLine);
        return ResponseEntity.ok(profile);
    }

    // Endpoint: GET /api/players/{gameName}/{tagLine}/puuid
    @GetMapping("/{gameName}/{tagLine}/puuid")
    public ResponseEntity<Map<String, String>> getPuuid(
            @PathVariable String gameName,
            @PathVariable String tagLine) {
            String puuid =playerProfileService.getPuuidFromDatabase(gameName, tagLine);
            return ResponseEntity.ok(Map.of("puuid", puuid));
    }

    // Endpoint: GET /api/players/{gameName}/{tagLine}/{queue}
    @GetMapping("/{gameName}/{tagLine}/{queue}")
    public ResponseEntity<LeagueEntry> getQueueRank(
            @PathVariable String gameName,
            @PathVariable String tagLine,
            @PathVariable String queue
    ){
        String queueKey = switch (queue.toLowerCase()) {
            case "solo", "soloduo", "ranked_solo_5x5" -> "RANKED_SOLO_5x5";
            case "flex", "ranked_flex_sr" -> "RANKED_FLEX_SR";
            default -> queue.toUpperCase();
        };

        PlayerProfile profile = playerProfileService.getPlayerProfile(gameName, tagLine);

        if (profile.ranks() == null || !profile.ranks().containsKey(queueKey)) {
            return ResponseEntity.notFound().build();
        }
        LeagueEntry rankEntry = profile.ranks().get(queueKey);
        return ResponseEntity.ok(rankEntry);
    }
    // Endpoint: GET /api/players/{gameName}/{tagLine}/icon
    @GetMapping("/{gameName}/{tagLine}/icon")
    public ResponseEntity<Map<String, String>> getIcon(
        @PathVariable String gameName,
        @PathVariable String tagLine
            ){
        String iconUrl =playerProfileService.getIconFromDatabase(gameName, tagLine);
        return ResponseEntity.ok(Map.of("iconUrl", iconUrl));
    }


}
