package org.example.controller;

import org.example.model.PlayerMatches;
import org.example.service.MatchesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.service.MatchesService;

@RestController
@RequestMapping("/api/matches")
public class MatchesController {
    private final MatchesService matchesService;


    public MatchesController(MatchesService matchesService){
        this.matchesService = matchesService;
    }

    // GET /api/matches/{puuid}?count=20
    @GetMapping("/{puuid}")
    public ResponseEntity<PlayerMatches> getMatches(
            @PathVariable String puuid,
            @RequestParam(defaultValue = "20") int count) {
        return ResponseEntity.ok(matchesService.getOrFetchPlayerMatches(puuid, count));
    }


}
