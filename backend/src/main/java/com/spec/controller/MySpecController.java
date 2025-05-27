package com.spec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spec.domain.MySpec;
import com.spec.repository.MySpecRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/myspec")
@RequiredArgsConstructor
public class MySpecController {
    private final MySpecRepository mySpecRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getMySpec(@PathVariable String userId) {
        return mySpecRepository.findByUserId(userId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMySpec(@RequestBody MySpec mySpec) {
        if (mySpecRepository.existsByUserId(mySpec.getUserId())) {
            return ResponseEntity.status(409).body("이미 등록된 스펙이 있습니다.");
        }
        return ResponseEntity.ok(mySpecRepository.save(mySpec));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateMySpec(@PathVariable String userId, @RequestBody MySpec mySpec) {
        return mySpecRepository.findByUserId(userId)
            .map(existing -> {
                mySpec.setId(existing.getId());
                mySpec.setUserId(userId);
                return ResponseEntity.ok(mySpecRepository.save(mySpec));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}