package org.example.repository;

import org.example.model.PlayerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends MongoRepository<PlayerProfile, String> {
    //Generowanie zapytania wyszukajacego po nicku i tagu bez wzgledu na wielkosc liter
    Optional<PlayerProfile> findByGameNameIgnoreCaseAndTagLineIgnoreCase(String gameName, String tagLine);
}
