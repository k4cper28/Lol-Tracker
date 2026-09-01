package org.example.controller;

import org.example.model.PlayerProfile;
import org.example.service.PlayerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
