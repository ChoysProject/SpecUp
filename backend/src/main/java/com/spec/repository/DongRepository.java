package com.spec.repository;

import com.spec.domain.Dong;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DongRepository extends MongoRepository<Dong, String> {
    List<Dong> findByNameContaining(String keyword);
} 