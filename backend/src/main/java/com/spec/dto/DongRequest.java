package com.spec.dto;

import lombok.Data;

@Data
public class DongRequest {
    private String name;   // 동 이름
    private String city;   // 시/군/구
    private String code;   // 동 코드 (필요시)
} 