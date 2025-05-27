package com.spec.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;


public interface MySpecRepository extends MongoRepository<MySpec, String> {
    Optional<MySpec> findByUserId(String userId);
    boolean existsByUserId(String userId);
}