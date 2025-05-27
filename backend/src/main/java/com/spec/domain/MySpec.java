package com.spec.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Document(collection = "myspecs")
public class MySpec {
    @Id
    private String id;
    private String userId;
    private String name;
    private String photoUrl;
    private Integer age;
    private String birth;
    private String phone;
    private String address;
    private String email;
    private List<Career> careers;
    private List<Education> educations;
    private List<String> skills;
    private List<Experience> experiences;
    private List<Certificate> certificates;
    private List<Portfolio> portfolios;
    private String selfIntro;
}
