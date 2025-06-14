package com.spec.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "dongs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dong {
    @Id
    private String id;
    private String name;
    private String city;
    private String code;
} 