package com.spec.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "chatrooms")
@Data
public class ChatRoom {
    @Id
    private String id;
    private String roomId; // UUID
    private String title;
    private String field; // 분야/자격증 등
    private String createdBy;
    private LocalDateTime createdAt;
} 