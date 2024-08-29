package com.example.running.teamincruit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.example.running.teamincruit.domain.SportsCenter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class SportsCenterServiceImpl implements SportsCenterService {

    @Value("${api.sportscenter.url}")
    private String apiUrl;

    @Value("${api.sportscenter.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public SportsCenterServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper(); // JSON 변환을 위한 ObjectMapper
    }

    @Override
    public List<SportsCenter> fetchSportsCenters(int pageNo, int numOfRows) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("pageNo", pageNo)
                    .queryParam("numOfRows", numOfRows)
                    .queryParam("resultType", "json")
                    .queryParam("serviceKey", apiKey)
                    .toUriString();

            System.out.println("Request URL: " + url);

            String jsonResponse = restTemplate.getForObject(url, String.class);

            System.out.println("Response: " + jsonResponse);

            return parseJsonResponse(jsonResponse);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching sports centers", e);
        }
    }

    private List<SportsCenter> parseJsonResponse(String jsonResponse) {
        try {
            Map<String, Object> map = objectMapper.readValue(jsonResponse, Map.class);
            Map<String, Object> responseBody = (Map<String, Object>) map.get("response");
            Map<String, Object> body = (Map<String, Object>) responseBody.get("body");
            List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");

            return objectMapper.convertValue(items, objectMapper.getTypeFactory().constructCollectionType(List.class, SportsCenter.class));
        } catch (Exception e) {
            throw new RuntimeException("JSON을 처리하는 중 오류가 발생했습니다.", e);
        }
    }

}



