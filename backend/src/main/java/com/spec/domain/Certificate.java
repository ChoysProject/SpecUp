package com.spec.domain;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certificate {
    private String name;
    private String date;
    private String org;
} 
