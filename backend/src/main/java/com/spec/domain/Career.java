package com.spec.domain;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Career {
    private String company;
    private String job;
    private String team;
    private String period;
    private String desc;
    private List<String> detail;
    private String startDate;
    private String endDate;
} 