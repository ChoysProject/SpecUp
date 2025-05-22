package com.spec.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Document(collection = "certifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certification {
    @Id
    private String id; // ID 타입은 String으로 변경했는지 확인

    private String name;
    private String issuer;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String description;
}