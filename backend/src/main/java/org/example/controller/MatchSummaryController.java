package org.example.controller;

import org.example.dto.MatchCardDto;
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
    public ResponseEntity<Page<MatchCardDto>> getPlayerMatches(
            @PathVariable String puuid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<MatchCardDto> matchPage = matchSummaryService.getPlayerMatchCards(puuid, page, size);
        return ResponseEntity.ok(matchPage);
    }
}