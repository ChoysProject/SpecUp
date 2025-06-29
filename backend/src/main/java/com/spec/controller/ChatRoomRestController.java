package com.spec.controller;

import com.spec.domain.ChatRoom;
import com.spec.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
public class ChatRoomRestController {
    private final ChatRoomService chatRoomService;

    @PostMapping
    public ChatRoom createRoom(@RequestBody CreateRoomRequest req) {
        return chatRoomService.createRoom(req.getTitle(), req.getField(), req.getCreatedBy());
    }

    @GetMapping
    public List<ChatRoom> getRooms(@RequestParam(required = false) String field) {
        return chatRoomService.getRoomsByField(field);
    }

    @GetMapping("/{roomId}")
    public ChatRoom getRoom(@PathVariable String roomId) {
        return chatRoomService.getRoomByRoomId(roomId);
    }

    public static class CreateRoomRequest {
        private String title;
        private String field;
        private String createdBy;
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getField() { return field; }
        public void setField(String field) { this.field = field; }
        public String getCreatedBy() { return createdBy; }
        public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    }
} 