package com.spec.domain;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Education {
    private String school;
    private String major;
    private String period;
    private String location; // 선택값
    private String degree; // 추가: 학위 (학사, 석사, 박사 등)
} 
