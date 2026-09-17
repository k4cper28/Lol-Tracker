package org.example.repository;

import org.example.model.PlayerMastery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasteryRepository extends MongoRepository<PlayerMastery,String> {
    @Query(value = "{ '_id': ?0 }", fields = "{ 'champions': { '$slice': 3 } }")
    Optional<PlayerMastery> findTop3MasteriesByPuuid(String puuid);
}
