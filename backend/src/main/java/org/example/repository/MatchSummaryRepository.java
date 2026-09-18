package org.example.repository;

import org.example.model.MatchSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchSummaryRepository extends MongoRepository<MatchSummary, String> {
    // Szybkie pobranie gotowych podsumowań dla listy ID meczów gracza
    List<MatchSummary> findByMatchIdIn(List<String> matchIds);

    Page<MatchSummary> findByParticipantsPuuid(String puuid, Pageable pageable);

    @Query(value = "{ 'participants.puuid': ?0 }", sort = "{ 'gameCreation': -1 }")
    List<MatchSummary> findRecentMatchesByPuuid(String puuid, Pageable pageable);

}