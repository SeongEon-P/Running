package com.example.running.teamincruit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.example.running.teamincruit.domain.SportsCenter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("pageNo", pageNo)
                .queryParam("numOfRows", numOfRows)
                .queryParam("resultType", "xml") // XML로 응답을 받음
                .queryParam("serviceKey", apiKey)
                .toUriString();

        String xmlResponse = restTemplate.getForObject(url, String.class);

        // XML을 JSON으로 변환
        List<SportsCenter> sportsCenters = parseXmlToJson(xmlResponse);

        return sportsCenters;
    }

    private List<SportsCenter> parseXmlToJson(String xmlResponse) {
        try {
            // XML을 JSON으로 변환
            XmlMapper xmlMapper = new XmlMapper();
            Map<String, Object> map = xmlMapper.readValue(xmlResponse, Map.class);

            // JSON을 SportsCenter 객체로 변환
            Map<String, Object> responseBody = (Map<String, Object>) map.get("response");
            Map<String, Object> body = (Map<String, Object>) responseBody.get("body");
            List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");

            return objectMapper.convertValue(items, objectMapper.getTypeFactory().constructCollectionType(List.class, SportsCenter.class));
        } catch (Exception e) {
            // 오류 발생 시 예외 처리
            throw new RuntimeException("XML을 JSON으로 변환하는 중 오류가 발생했습니다.", e);
        }
    }
}



