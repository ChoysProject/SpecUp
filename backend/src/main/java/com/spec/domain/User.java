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
    // 약관 동의 등 필요한 필드는 추후 추가
}