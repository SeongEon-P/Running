package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.dto.upload.UploadFileDTO;
import com.example.running.teamincruit.service.TeamManageImgService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.running.teamincruit.dto.upload.UploadFileDTO;
import com.example.running.teamincruit.dto.upload.UploadResultDTO;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@Log4j2
@RequiredArgsConstructor
public class UpDownController {

    private final TeamManageImgService teamManageImgService;

    @Value("${org.zerock.upload.path}")
    private String uploadPath;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(@RequestParam("teamName") String teamName, @RequestParam("files") MultipartFile[] files) {
        try {
            List<Map<String, String>> uploadedFiles = new ArrayList<>();

            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (!file.isEmpty()) {
                    String originalName = file.getOriginalFilename();
                    String uuid = UUID.randomUUID().toString();
                    String fileName = originalName;

                    // 파일 저장
                    Path savePath = Paths.get(uploadPath, fileName);
                    file.transferTo(savePath);

                    // 이미지 저장 로직 호출
                    teamManageImgService.saveUploadedImages(uuid, teamName, fileName, i);

                    // 업로드된 파일 정보를 리스트에 추가
                    Map<String, String> fileInfo = new HashMap<>();
                    fileInfo.put("fileName", fileName);
                    uploadedFiles.add(fileInfo);
                }
            }

            // 업로드된 파일 정보를 포함한 응답 반환
            return ResponseEntity.ok(uploadedFiles);
        } catch (IOException e) {
            log.error("파일 업로드 오류: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Controller를 이용한 파일 취득 방식
    @Tag(name = "view 파일", description = "GET방식으로 첨부파일 조회")
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
        // 파일명 디코딩 처리
        String decodedFileName = java.net.URLDecoder.decode(fileName, StandardCharsets.UTF_8);
        // 파일 받아오기("C:\\upload\\aaa.jpg")
        Resource resource = new FileSystemResource(uploadPath + File.separator + decodedFileName);
        String resourceName = resource.getFilename();
        //headers를 try안과 밖에서 모두 사용하기 위해 밖에 선언
        HttpHeaders headers = new HttpHeaders();
        try {
            //이미지 파일의 Content-Type을 설정 : image/jpeg
            headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
        } catch (IOException e) {
            //에러 발생시 에러 스테이터스 전달 = 500에러 코드 실행시 에러
            return ResponseEntity.internalServerError().build();
        }
        //정상실행시 파일과 정상 스테이터스 전달 200:정상 실행
        return ResponseEntity.ok().headers(headers).body(resource);
    }

    @Tag(name = "remove파일", description = "DELETE 방식으로 파일 삭제")
    @DeleteMapping("/remove/{fileName}")
    public Map<String, Boolean> removeFile(@PathVariable String fileName) {
        Map<String, Boolean> resultMap = new HashMap<>();
        boolean removed = false;

        try {
            // 파일 시스템에서 파일 삭제
            Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
            removed = resource.getFile().delete();

            if (removed) {
                // 데이터베이스에서 해당 이미지 레코드 삭제
                teamManageImgService.deleteImageByFileName(fileName);
            }

        } catch (IOException e) {
            log.error("파일 삭제 중 오류 발생: " + e.getMessage());
        }

        resultMap.put("result", removed);
        return resultMap;
    }




}
