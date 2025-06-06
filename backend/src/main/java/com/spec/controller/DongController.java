package com.spec.controller;

import com.spec.dto.DongRequest;
import com.spec.service.DongService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dong")
@RequiredArgsConstructor
public class DongController {
    private final DongService dongService;

    @GetMapping
    public List<DongRequest> searchDong(@RequestParam String keyword) {
        return dongService.searchDong(keyword);
    }
} 