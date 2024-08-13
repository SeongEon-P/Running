package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.dto.upload.UploadFileDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@Log4j2
public class UpDownController {
  @Value("${org.zerock.upload.path}")
  private String uploadPath;

  @Tag(name = "Upload POST", description = "POST 방식으로 파일 등록")
  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<List<UploadResultDTO>> upload(@RequestParam("files") MultipartFile[] files) {
    List<UploadResultDTO> resultList = new ArrayList<>();

    for (MultipartFile file : files) {
      if (!file.isEmpty()) {
        try {
          String originalName = file.getOriginalFilename();
          String uuid = UUID.randomUUID().toString();
          String fileName = uuid + "_" + originalName;

          // 파일 저장
          Path savePath = Paths.get(uploadPath, fileName);
          file.transferTo(savePath);

          // 이미지 여부 판단
          boolean isImage = originalName != null && originalName.toLowerCase().matches(".*\\.(jpg|jpeg|png|gif|bmp)$");

          // 결과 객체 생성
          UploadResultDTO resultDTO = UploadResultDTO.builder()
                  .uuid(uuid)
                  .fileName(originalName)
                  .img(isImage)
                  .build();
          resultList.add(resultDTO);
        } catch (IOException e) {
          log.error("파일 업로드 오류: " + e.getMessage(), e);
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
      }
    }

    // 업로드 결과 반환
    return ResponseEntity.ok(resultList);
  }


  //Controller를 이용한 파일 취득 방식
  @Tag(name = "view 파일", description = "GET방식으로 첨부파일 조회")
  @GetMapping("/view/{fileName}")
  public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){
    // 파일 받아오기("C:\\upload\\aaa.jpg")
    Resource resource = new FileSystemResource(uploadPath+ File.separator +fileName);
    String resourceName = resource.getFilename();
    //headers를 try안과 밖에서 모두 사용하기 위해 밖에 선언
    HttpHeaders headers = new HttpHeaders();
    try{
      //이미지 파일의 Content-Type을 설정 : image/jpeg
      headers.add("Content-Type",Files.probeContentType(resource.getFile().toPath()));
    }catch(IOException e){
      //에러 발생시 에러 스테이터스 전달 = 500에러 코드 실행시 에러
      return ResponseEntity.internalServerError().build();
    }
    //정상실행시 파일과 정상 스테이터스 전달 200:정상 실행
    return ResponseEntity.ok().headers(headers).body(resource);
  }

  @Tag(name = "remove파일", description = "DELETE 방식으로 파일 삭제")
  @DeleteMapping("/remove/{fileName}")
  public Map<String, Boolean> removeFile(@PathVariable String fileName){
    Resource resource = new FileSystemResource(uploadPath+ File.separator +fileName);
    String resourceName = resource.getFilename();
    Map<String,Boolean> resultMap = new HashMap<>();
    boolean removed = false;
    try{
      String contentType = Files.probeContentType(resource.getFile().toPath());
      removed = resource.getFile().delete();
      if(contentType.startsWith("image")){
        File thumbailFile = new File(uploadPath+File.separator+"s_"+fileName);
        thumbailFile.delete();
      }
    }catch(IOException e){
      log.error(e.getMessage());
    }
    resultMap.put("result",removed);
    return resultMap;
  }

}
