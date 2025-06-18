package com.spec.service;

import com.spec.domain.User;
import com.spec.dto.LoginRequest;
import com.spec.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public Map<String, Object> login(LoginRequest loginRequest) {
        log.info("로그인 시도: {}", loginRequest.getEmail());
        
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            log.warn("존재하지 않는 이메일: {}", loginRequest.getEmail());
            throw new RuntimeException("NOT_REGISTERED");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("잘못된 비밀번호 시도: {}", loginRequest.getEmail());
            throw new RuntimeException("INVALID_PASSWORD");
        }
        
        log.info("로그인 성공: {}", loginRequest.getEmail());
        
        // jobInterests와 certInterests 상태 체크
        boolean hasJobInterests = user.getJobInterests() != null && !user.getJobInterests().isEmpty();
        boolean hasCertInterests = user.getCertInterests() != null && !user.getCertInterests().isEmpty();
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getUserId());
        response.put("hasJobInterests", hasJobInterests);
        response.put("hasCertInterests", hasCertInterests);
        
        return response;
    }
} 