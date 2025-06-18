package com.spec.controller;

import com.spec.domain.User;
import com.spec.dto.LoginRequest;
import com.spec.dto.RegisterRequest;
import com.spec.repository.UserRepository;
import com.spec.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import com.spec.security.JwtTokenProvider;
import com.spec.service.SequenceGeneratorService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final UserRepository userRepository;
    private final AuthService authService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> loginResult = authService.login(loginRequest);
            
            // JWT 토큰 생성
            String token = jwtTokenProvider.createToken(loginRequest.getEmail(), java.util.Arrays.asList("ROLE_USER"));
            loginResult.put("accessToken", token);
            
            return ResponseEntity.ok(loginResult);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("NOT_REGISTERED")) {
                return ResponseEntity.status(404).body("NOT_REGISTERED");
            } else if (e.getMessage().equals("INVALID_PASSWORD")) {
                return ResponseEntity.status(401).body("INVALID_PASSWORD");
            }
            return ResponseEntity.status(500).body("INTERNAL_SERVER_ERROR");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.status(409).body("ALREADY_REGISTERED");
        }
        
        User user = User.builder()
                .userId(sequenceGeneratorService.generateUserId())
                .email(registerRequest.getEmail())
                .name(registerRequest.getName())
                .phone(registerRequest.getPhone())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .agreeAge(registerRequest.isAgreeAge())
                .agreeTerms(registerRequest.isAgreeTerms())
                .agreePrivacy(registerRequest.isAgreePrivacy())
                .agreeMarketing(registerRequest.isAgreeMarketing())
                .birth(registerRequest.getBirth())
                .homeAddress(registerRequest.getHomeAddress())
                .workAddress(registerRequest.getWorkAddress())
                .interestAddress(registerRequest.getInterestAddress())
                .jobInterests(new java.util.ArrayList<>())
                .certInterests(new java.util.ArrayList<>())
                .roles(java.util.Arrays.asList("ROLE_USER"))
                .build();
        userRepository.save(user);
        log.info("회원가입 저장: {}", user.toString());
        return ResponseEntity.ok("REGISTERED");
    }
}