package com.spec.repository;

import com.spec.domain.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends MongoRepository<Board, String> {
    // 필요시 커스텀 쿼리 추가
} 