package org.example.service;

import org.example.Mapper.MatchCardMapper;
import org.example.dto.MatchCardDto;
import org.example.model.MatchSummary;
import org.example.repository.MatchSummaryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;



@Service
public class MatchSummaryService {
    private final MatchSummaryRepository repository;
    private final MatchCardMapper mapper;

    public MatchSummaryService(MatchSummaryRepository repository, MatchCardMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Page<MatchCardDto> getPlayerMatchCards(String puuid, int page, int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "gameEndTimestamp")
        );

        Page<MatchSummary> matchPage = repository.findByParticipantsPuuid(puuid, pageable);

        return matchPage.map(match -> mapper.toCardDto(match, puuid));
    }

}
