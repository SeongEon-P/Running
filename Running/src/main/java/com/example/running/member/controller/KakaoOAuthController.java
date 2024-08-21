package com.example.running.member.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/members/kakao")
@CrossOrigin(origins = "http://localhost:3000")
public class KakaoOAuthController {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    // 인가 코드 재사용을 방지하기 위해 사용된 코드를 저장할 Set
    private final Set<String> usedAuthorizationCodes = ConcurrentHashMap.newKeySet();

    @PostMapping("/callback")
    public ResponseEntity<?> kakaoCallback(@RequestBody Map<String, String> payload) {
        String code = payload.get("code"); // 프론트엔드에서 전달된 인가 코드
        System.out.println("인가코드 로그 출력: " + code);

        // 인가 코드가 이미 사용된 경우 처리
        if (usedAuthorizationCodes.contains(code)) {
            System.err.println("이미 사용된 인가 코드: " + code);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용된 인가 코드입니다.");
        }

        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("redirect_uri", redirectUri);
            params.add("code", code); // 새로운 인가 코드 사용
            params.add("client_secret", clientSecret);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );
            System.out.println("카카오 응답 로그: " + response);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> body = response.getBody();
                String accessToken = (String) body.get("access_token");

                if (accessToken == null || accessToken.isEmpty()) {
                    System.err.println("엑세스 토큰이 null 또는 비어있습니다: " + body);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("엑세스 토큰을 가져오지 못했습니다.");
                }

                // 인가 코드를 사용 후 Set에 추가하여 재사용 방지
                usedAuthorizationCodes.add(code);

                return ResponseEntity.ok().body(Map.of("accessToken", accessToken));
            } else {
                System.err.println("카카오 응답 에러: " + response.getBody());
                return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error: " + e.getMessage());
        }
    }
}
