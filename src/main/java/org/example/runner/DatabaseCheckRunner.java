package org.example.runner;

import org.bson.BsonDocument;
import org.bson.BsonInt64;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseCheckRunner implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    // Spring automatycznie wstrzykuje skonfigurowany obiekt bazy
    public DatabaseCheckRunner(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            var db = mongoTemplate.getDb();
            Document pingResult = db.runCommand(new BsonDocument("ping", new BsonInt64(1)));

            System.out.println("==================================================");
            System.out.println(" Połączono pomyślnie z MongoDB!");
            System.out.println(" Baza danych: " + db.getName());
            System.out.println(" Status ping: " + pingResult.toJson());
            System.out.println("==================================================");
        } catch (Exception e) {
            System.err.println(" Błąd połączenia z MongoDB: " + e.getMessage());
        }
    }
}