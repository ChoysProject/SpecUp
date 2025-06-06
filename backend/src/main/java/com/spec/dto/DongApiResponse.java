package com.spec.dto;

import lombok.Data;
import java.util.List;

@Data
public class DongApiResponse {
    private int currentCount;
    private List<DongData> data;
    private int matchCount;
    private int page;
    private int perPage;
    private int totalCount;

    @Data
    public static class DongData {
        private String 소재지;
        private String 존재여부;
        private String 코드명;
    }
} 