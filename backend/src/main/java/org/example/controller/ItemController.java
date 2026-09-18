package org.example.controller;

import org.example.model.ItemVersionDocument;
import org.example.repository.ItemVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {
    @Autowired
    private ItemVersionRepository itemVersionRepository;

    @GetMapping("/{patch}")
    public ResponseEntity<Map<String, ItemVersionDocument.SimpleItem>> getItemsByPatch(
            @PathVariable String patch){
        return itemVersionRepository.findAll().stream()
                .filter(doc -> patch.equals(doc.patch()))
                .findFirst()
                .map(doc -> ResponseEntity.ok(doc.items()))
                .orElseGet(() -> ResponseEntity.ok(Collections.emptyMap()));
    }
}
