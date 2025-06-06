package com.spec.scheduler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spec.dto.DongApiResponse;
import com.spec.dto.DongRequest;
import com.spec.service.DongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.converter.StringHttpMessageConverter;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DongScheduler {
    private final DongService dongService;

    @Scheduled(cron = "0 0 0 * * *")
    public void fetchAndSaveAllDongList() {
        log.info("동 데이터 전체 갱신 시작");
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        int perPage = 1000;
        int page = 1;
        int totalCount = 0;
        List<DongRequest> allDongList = new ArrayList<>();

        String rawServiceKey = "xmkiElQCKZTNK6eVPtNQHakhblk7x7Vuhs+mTeAMeGdt3ZPchnjrWwJiJnhW4bELjRTLf3WJHTymkgLXJ6d1jw==";
        String encodedServiceKey = URLEncoder.encode(rawServiceKey, StandardCharsets.UTF_8);

        do {
            String fullUrl = "https://api.odcloud.kr/api/15123287/v1/uddi:c167d44a-d8ad-4624-b442-a67e904635d0"
                    + "?page=" + page
                    + "&perPage=" + perPage
                    + "&serviceKey=" + encodedServiceKey;
            URI uri = URI.create(fullUrl);
            log.info("Request URI: {}", uri);

            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

            if (response.getBody() != null) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    DongApiResponse apiResponse = objectMapper.readValue(response.getBody(), DongApiResponse.class);
                    for (DongApiResponse.DongData data : apiResponse.getData()) {
                        DongRequest req = new DongRequest();
                        String 소재지 = data.get소재지(); // 예: "서울특별시 광진구 능동"
                        String[] tokens = 소재지 != null ? 소재지.split(" ") : new String[0];
                        if (tokens.length >= 3) {
                            String city = tokens[0] + " " + tokens[1]; // "서울특별시 광진구"
                            String dong = tokens[2]; // "능동"
                            req.setCity(city);
                            req.setName(dong);
                        } else {
                            req.setCity("");
                            req.setName(소재지);
                        }
                        req.setCode(data.get코드명());
                        allDongList.add(req);
                    }
                    totalCount = apiResponse.getTotalCount();
                    log.info("page {} 수집 완료 (누적: {})", page, allDongList.size());
                } catch (Exception e) {
                    log.error("JSON 파싱 오류", e);
                    break;
                }
            } else {
                break;
            }
            page++;
        } while ((page - 1) * perPage < totalCount);

        dongService.saveDongList(allDongList);
        log.info("동 데이터 전체 갱신 완료: {}건", allDongList.size());
    }
} 