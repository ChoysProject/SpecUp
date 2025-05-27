package com.spec.domain;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Education {
    private String school;
    private String major;
    private String period;
    private String location; // 선택값
} 
