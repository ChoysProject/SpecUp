package com.spec.controller;

import com.spec.domain.User;
import com.spec.dto.LoginRequest;
import com.spec.dto.RegisterRequest;
import com.spec.repository.UserRepository;
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
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private SequenceGeneratorService sequenceGeneratorService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("NOT_REGISTERED");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("INVALID_PASSWORD");
        }
    
        // JWT 토큰 생성 (예시)
        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRoles());
    
        // accessToken과 userId를 JSON으로 반환
        Map<String, String> response = new HashMap<>();
        response.put("accessToken", token);
        response.put("userId", user.getUserId());
        return ResponseEntity.ok(response);
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
                .build();
        userRepository.save(user);
        log.info("회원가입 저장: {}", user.toString());
        return ResponseEntity.ok("REGISTERED");
    }
}