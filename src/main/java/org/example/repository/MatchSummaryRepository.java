package org.example.repository;

import org.example.model.MatchSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchSummaryRepository extends MongoRepository<MatchSummary, String> {
    // Szybkie pobranie gotowych podsumowań dla listy ID meczów gracza
    List<MatchSummary> findByMatchIdIn(List<String> matchIds);
}