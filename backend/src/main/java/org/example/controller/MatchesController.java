package org.example.controller;

import org.example.model.MatchesDetails;
import org.example.model.PlayerMatches;
import org.example.service.MatchesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.service.MatchesService;

import java.util.List;

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
            @RequestParam(defaultValue = "20") int count,
            @RequestParam(defaultValue = "false") boolean force
            ) {
        return ResponseEntity.ok(matchesService.getOrFetchPlayerMatches(puuid, count, force));
    }

    @GetMapping("/{puuid}/details")
    public ResponseEntity<List<MatchesDetails>> getPlayerMatchesDetails(
            @PathVariable String puuid,
            @RequestParam(defaultValue = "20") int count,
            @RequestParam(defaultValue = "false") boolean force) {
        return ResponseEntity.ok(matchesService.getOrFetchPlayerMatchesWithDetails(puuid, count, force));
    }

}
