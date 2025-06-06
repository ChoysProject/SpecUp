package com.spec.service;

import com.spec.dto.DongRequest;
import com.spec.domain.Dong;
import com.spec.repository.DongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DongService {
    private final DongRepository dongRepository;

    public List<DongRequest> searchDong(String keyword) {
        return dongRepository.findByNameContaining(keyword)
                .stream()
                .map(d -> {
                    DongRequest req = new DongRequest();
                    req.setName(d.getName());
                    req.setCity(d.getCity());
                    req.setCode(d.getCode());
                    return req;
                })
                .collect(Collectors.toList());
    }

    public void saveDongList(List<DongRequest> dongList) {
        dongRepository.deleteAll();
        List<Dong> entities = dongList.stream().map(req -> {
            Dong d = new Dong();
            d.setName(req.getName());
            d.setCity(req.getCity());
            d.setCode(req.getCode());
            return d;
        }).collect(Collectors.toList());
        dongRepository.saveAll(entities);
    }
} 