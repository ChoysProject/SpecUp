package com.spec.repository;

import com.spec.domain.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findByField(String field);
    ChatRoom findByRoomId(String roomId);
} 