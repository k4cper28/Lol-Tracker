package org.example.repository;

import org.example.model.MatchSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface MatchSummaryRepository extends MongoRepository<MatchSummary, String> {
    // Szybkie pobranie gotowych podsumowań dla listy ID meczów gracza
    List<MatchSummary> findByMatchIdIn(List<String> matchIds);

    Page<MatchSummary> findByParticipantsPuuid(String puuid, Pageable pageable);
}