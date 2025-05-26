package com.spec.dto;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
public class RegisterRequest {
    private String email;
    private String name;
    private String phone;
    private String password;
    private boolean agreeAge;
    private boolean agreeTerms;
    private boolean agreePrivacy;
    private boolean agreeMarketing;
}