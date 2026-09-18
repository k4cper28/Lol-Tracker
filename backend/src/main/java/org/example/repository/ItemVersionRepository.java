package org.example.repository;

import org.example.model.ItemVersionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemVersionRepository extends MongoRepository<ItemVersionDocument,String> {
    boolean existsByPatch(String patch);
}
