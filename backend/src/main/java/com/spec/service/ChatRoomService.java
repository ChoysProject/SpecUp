package com.spec.service;

import com.spec.domain.ChatRoom;
import com.spec.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;

    public ChatRoom createRoom(String title, String field, String createdBy) {
        ChatRoom room = new ChatRoom();
        room.setRoomId(UUID.randomUUID().toString());
        room.setTitle(title);
        room.setField(field);
        room.setCreatedBy(createdBy);
        room.setCreatedAt(LocalDateTime.now());
        return chatRoomRepository.save(room);
    }

    public List<ChatRoom> getRoomsByField(String field) {
        if (field == null || field.equals("전체")) {
            return chatRoomRepository.findAll();
        }
        return chatRoomRepository.findByField(field);
    }

    public ChatRoom getRoomByRoomId(String roomId) {
        return chatRoomRepository.findByRoomId(roomId);
    }
} 