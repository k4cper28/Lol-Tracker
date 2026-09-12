package org.example.repository;

import org.example.model.MatchesDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchDetailsRepository extends MongoRepository<MatchesDetails, String> {
    List<MatchesDetails> findByMatchIdIn(List<String> matchIds);
}
