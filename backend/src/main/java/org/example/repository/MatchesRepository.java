package org.example.repository;

import org.example.model.PlayerMatches;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchesRepository extends MongoRepository<PlayerMatches, String> {

}
