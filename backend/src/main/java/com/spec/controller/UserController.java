package com.spec.controller;

import com.spec.domain.User;
import com.spec.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable String userId) {
        return userRepository.findByUserId(userId)
            .map(user -> {
                // 경력 만년수 계산
                int totalMonths = 0;
                if (user.getCareers() != null) {
                    DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    for (var c : user.getCareers()) {
                        if (c.getStartDate() != null && !c.getStartDate().isEmpty()) {
                            LocalDate start = LocalDate.parse(c.getStartDate(), fmt);
                            LocalDate end = (c.getEndDate() != null && !c.getEndDate().isEmpty()) ? LocalDate.parse(c.getEndDate(), fmt) : LocalDate.now();
                            totalMonths += Period.between(start, end).getYears() * 12 + Period.between(start, end).getMonths();
                        }
                    }
                }
                double totalYears = Math.round((totalMonths / 12.0) * 10) / 10.0; // 소수점 1자리

                // 최고 학력 추출 (degree 기준, 없으면 마지막 학력)
                String topDegree = null;
                String topSchool = null;
                if (user.getEducations() != null && !user.getEducations().isEmpty()) {
                    // degree 우선순위: 박사 > 석사 > 학사 > 기타
                    Comparator<String> degreeOrder = Comparator.comparingInt(d -> {
                        if (d == null) return 99;
                        if (d.contains("박사")) return 1;
                        if (d.contains("석사")) return 2;
                        if (d.contains("학사")) return 3;
                        return 99;
                    });
                    var topEdu = user.getEducations().stream()
                        .sorted((a, b) -> degreeOrder.compare(a.getDegree(), b.getDegree()))
                        .findFirst().orElse(user.getEducations().get(0));
                    topDegree = topEdu.getDegree();
                    topSchool = topEdu.getSchool();
                }

                // 네모 박스용 데이터
                var boxCareers = user.getCareers() != null ? user.getCareers().stream().map(c -> c.getCompany()).collect(Collectors.toList()) : null;
                var boxEducations = user.getEducations() != null ? user.getEducations().stream().map(e -> e.getSchool()).collect(Collectors.toList()) : null;
                var boxPortfolios = user.getPortfolios() != null ? user.getPortfolios().stream().map(p -> p.getName()).collect(Collectors.toList()) : null;
                var boxCertificates = user.getCertificates() != null ? user.getCertificates().stream().map(c -> c.getName()).collect(Collectors.toList()) : null;

                // 커스텀 응답 DTO
                var resp = new java.util.HashMap<String, Object>();
                resp.put("name", user.getName());
                resp.put("email", user.getEmail());
                resp.put("phone", user.getPhone());
                resp.put("birth", user.getBirth());
                resp.put("age", user.getAge());
                resp.put("address", user.getAddress());
                resp.put("photoUrl", user.getPhotoUrl());
                resp.put("careers", user.getCareers());
                resp.put("educations", user.getEducations());
                resp.put("skills", user.getSkills());
                resp.put("experiences", user.getExperiences());
                resp.put("certificates", user.getCertificates());
                resp.put("portfolios", user.getPortfolios());
                resp.put("selfIntro", user.getSelfIntro());
                resp.put("careerTotalYears", totalYears);
                resp.put("topDegree", topDegree);
                resp.put("topSchool", topSchool);
                resp.put("boxCareers", boxCareers);
                resp.put("boxEducations", boxEducations);
                resp.put("boxPortfolios", boxPortfolios);
                resp.put("boxCertificates", boxCertificates);
                resp.put("jobInterests", user.getJobInterests() != null ? user.getJobInterests() : new java.util.ArrayList<>());
                resp.put("certInterests", user.getCertInterests() != null ? user.getCertInterests() : new java.util.ArrayList<>());
                return ResponseEntity.ok(resp);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User user) {
        return userRepository.findByUserId(userId)
            .map(existing -> {
                user.setId(existing.getId());
                user.setUserId(userId);
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
    }
} 