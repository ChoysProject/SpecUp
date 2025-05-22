package com.spec.repository; 

import com.spec.domain.Certification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends MongoRepository<Certification, String> { // [변경] MongoRepository 상속 및 ID 타입 String으로 변경
    // Spring Data MongoDB가 기본적인 CRUD 메서드를 자동으로 제공합니다.
}