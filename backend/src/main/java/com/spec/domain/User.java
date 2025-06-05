package com.spec.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String name;
    private String phone;
    private String password;
    private boolean agreeAge;
    private boolean agreeTerms;
    private boolean agreePrivacy;
    private boolean agreeMarketing;
    private List<String> roles;
    private String userId; // U-1, U-2, ...
    private String photoUrl;
    private Integer age;
    private String birth;
    private String address;
    private String homeAddress; // 집 주소
    private String workAddress; // 직장 주소
    private String interestAddress; // 관심지역 주소
    private List<Career> careers;
    private List<Education> educations;
    private List<String> skills;
    private List<Experience> experiences;
    private List<Certificate> certificates;
    private List<Portfolio> portfolios;
    private String selfIntro;
    // 약관 동의 등 필요한 필드는 추후 추가
    private List<String> jobInterests;   // 업종/직무 관심사
    private List<String> certInterests;  // 관심 자격증
}