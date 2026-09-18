package org.example.repository;

import org.example.model.PlayerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends MongoRepository<PlayerProfile, String> {
    //Generowanie zapytania wyszukajacego po nicku i tagu bez wzgledu na wielkosc liter
    Optional<PlayerProfile> findByGameNameIgnoreCaseAndTagLineIgnoreCase(String gameName, String tagLine);
    @Query(value = "{ '_id': ?0 }", fields = "{ 'ranks.?1': 1 }")
    Optional<PlayerProfile> findRankByPuuidAndQueue(String puuid, String queue);

    // Szuka graczy, których gameName zaczyna się od wpisanego tekstu (case-insensitive)
    @Query(value = "{ 'gameName': { $regex: '^?0', $options: 'i' } }")
    List<PlayerProfile> findTop5ByGameNameStartingWith(String prefix);

}
