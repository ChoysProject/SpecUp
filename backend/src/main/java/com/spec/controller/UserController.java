package com.spec.controller;

import com.spec.domain.User;
import com.spec.repository.UserRepository;
import com.spec.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        return userRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        return userRepository.findByUserId(userId)
            .map(existing -> {
                user.setId(existing.getId());
                user.setUserId(userId);
                // 기존 비밀번호 유지
                if (user.getPassword() == null || user.getPassword().isEmpty()) {
                    user.setPassword(existing.getPassword());
                }
                // roles가 null이면 기본 role 추가
                if (user.getRoles() == null) {
                    user.setRoles(java.util.Arrays.asList("ROLE_USER"));
                }
                // photoUrl, certificates, selfIntro 등 주요 필드는 프론트에서 값이 없으면 기존 값 유지
                if (user.getPhotoUrl() == null || user.getPhotoUrl().isEmpty()) {
                    user.setPhotoUrl(existing.getPhotoUrl());
                }
                if (user.getCertificates() == null) {
                    user.setCertificates(existing.getCertificates());
                }
                if (user.getSelfIntro() == null) {
                    user.setSelfIntro(existing.getSelfIntro());
                }
                // 기타 필요한 필드도 동일하게 처리 가능
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/interests")
    public ResponseEntity<?> updateUserInterests(
            @PathVariable String userId,
            @RequestBody Map<String, List<String>> request) {
        try {
            log.info("Updating interests for user: {}", userId);
            List<String> jobInterests = request.get("jobInterests");
            List<String> certInterests = request.get("certInterests");
            
            log.info("Job interests: {}, Cert interests: {}", jobInterests, certInterests);
            
            User updatedUser = userService.updateUserInterests(userId, jobInterests, certInterests);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating user interests: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 자격증만 업데이트
    @PutMapping("/{userId}/certificates")
    public ResponseEntity<?> updateCertificates(@PathVariable String userId, @RequestBody List<com.spec.domain.Certificate> certificates) {
        return userRepository.findByUserId(userId)
            .map(user -> {
                user.setCertificates(certificates);
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // 사진만 업데이트
    @PutMapping("/{userId}/photo")
    public ResponseEntity<?> updatePhoto(@PathVariable String userId, @RequestBody Map<String, String> body) {
        String photoUrl = body.get("photoUrl");
        return userRepository.findByUserId(userId)
            .map(user -> {
                user.setPhotoUrl(photoUrl);
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // 기존 사용자들의 roles 필드를 업데이트하는 엔드포인트
    @PostMapping("/update-roles")
    public ResponseEntity<?> updateAllUsersRoles() {
        try {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                if (user.getRoles() == null) {
                    user.setRoles(java.util.Arrays.asList("ROLE_USER"));
                    userRepository.save(user);
                }
            }
            return ResponseEntity.ok("모든 사용자의 roles가 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("roles 업데이트 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
} 