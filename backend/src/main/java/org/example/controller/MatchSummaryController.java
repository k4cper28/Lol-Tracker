package org.example.controller;

import org.example.dto.MatchCardDto;
import org.example.model.MatchSummary;
import org.example.service.MatchSummaryService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
public class MatchSummaryController {

    private final MatchSummaryService matchSummaryService;

    public MatchSummaryController(MatchSummaryService matchSummaryService) {
        this.matchSummaryService = matchSummaryService;
    }

    @GetMapping("/player/{puuid}")
    public ResponseEntity<Page<MatchSummary>> getPlayerMatches(
            @PathVariable String puuid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Serwis zwraca bezpośrednio całe obiekty z bazy
        Page<MatchSummary> matchPage = matchSummaryService.getPlayerMatches(puuid, page, size);
        return ResponseEntity.ok(matchPage);
    }


}

