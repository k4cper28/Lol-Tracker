package org.example.repository;

import org.example.model.PlayerMastery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MasteryRepository extends MongoRepository<PlayerMastery,String> {
}
