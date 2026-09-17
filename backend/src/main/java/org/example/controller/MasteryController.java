package org.example.controller;

import org.example.model.PlayerMastery;
import org.example.service.PlayerMasteryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/player/mastery")
public class MasteryController {

    private final PlayerMasteryService playerMasteryService;

    public MasteryController(PlayerMasteryService playerMasteryService) {
        this.playerMasteryService = playerMasteryService;
    }

    @GetMapping("/{puuid}")
    public ResponseEntity<PlayerMastery> getMastery(@PathVariable("puuid") String puuid) {
        return ResponseEntity.ok(playerMasteryService.fetchAndSavePlayerMastery(puuid));
    }

    @GetMapping("/top3/{puuid}")
    public ResponseEntity<List<PlayerMastery.ChampionMastery>> getTop3Mastery(
            @PathVariable String puuid
    ) {
        return ResponseEntity.ok(playerMasteryService.getTop3Masteries(puuid));
    }


}