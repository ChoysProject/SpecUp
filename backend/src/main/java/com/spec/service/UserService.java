package com.spec.service;

import com.spec.domain.User;
import com.spec.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    
    public User updateUserInterests(String userId, List<String> jobInterests, List<String> certInterests) {
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            log.error("User not found with userId: {}", userId);
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        if (jobInterests != null) {
            user.setJobInterests(jobInterests);
            log.info("Updated jobInterests for user {}: {}", userId, jobInterests);
        }
        
        if (certInterests != null) {
            user.setCertInterests(certInterests);
            log.info("Updated certInterests for user {}: {}", userId, certInterests);
        }
        
        return userRepository.save(user);
    }
} 