package com.example.running.info.controller;

import com.example.running.Review.dto.ReviewDTO;
import com.example.running.Review.dto.ReviewResourceDTO;
import com.example.running.info.domain.Info;
import com.example.running.info.dto.InfoDTO;
import com.example.running.info.dto.InfoResourceDTO;
import com.example.running.info.service.InfoResourceService;
import com.example.running.info.service.InfoResourceServiceImpl;
import com.example.running.info.service.InfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/info")
@CrossOrigin("http://localhost:3000")
@Log4j2
public class InfoController {
    private final InfoService infoService;
    private final InfoResourceService infoResourceService;
    private final Path fileStorageLocation = Paths.get("file-storage").toAbsolutePath().normalize();

    @GetMapping("/list")
    public List<InfoDTO> getInfoList() {
        return infoService.findAllInfo();
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<InfoDTO> addInfo(
            @RequestParam("i_title") String iTitle,
            @RequestParam("i_content") String iContent,
            @RequestParam("writer") String writer,
            @RequestParam("is_important") boolean isImportant,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        InfoDTO infoDTO = new InfoDTO();
        infoDTO.setI_title(iTitle);
        infoDTO.setI_content(iContent);
        infoDTO.setWriter(writer);
        infoDTO.setImportant(isImportant);

        InfoDTO savedInfo = infoService.addInfo(infoDTO);

        if (files != null) {
            List<InfoResourceDTO> resourceDtoList = new ArrayList<>();
            int ord = 0;
            for (MultipartFile file : files) {
                Path savePath = Paths.get("C:\\upload",file.getOriginalFilename());
                try {
                    file.transferTo(savePath.toFile());
                    InfoResourceDTO dto = InfoResourceDTO.builder()
                            .ir_name(file.getOriginalFilename())
                            .ir_ord(ord++)
                            .ir_type(file.getContentType())
                            .ino(savedInfo.getIno())
                            .build();
                    resourceDtoList.add(dto);
                } catch (IOException e) {
                    log.error("파일 저장 중 오류 발생", e);
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            infoResourceService.saveAll(resourceDtoList);
        }

        return new ResponseEntity<>(savedInfo, HttpStatus.CREATED);
    }

    @PutMapping("/{ino}")
    public ResponseEntity<Object> modifyInfo(@PathVariable("ino") Long ino, @ModelAttribute InfoDTO infoDTO) {
        try {
            int ord = 0;
            List<InfoResourceDTO> resourceDTOList = new ArrayList<InfoResourceDTO>();
            if(infoDTO.getFiles() != null && !infoDTO.getFiles().isEmpty()){
                for (MultipartFile file : infoDTO.getFiles()) {
                    Path savePath = Paths.get("C:\\upload", file.getOriginalFilename());
                    try {
                        file.transferTo(savePath);
                        InfoResourceDTO dto = InfoResourceDTO.builder()
                                .ir_name(file.getOriginalFilename())
                                .ir_ord(ord++)
                                .ir_type(file.getContentType())
                                .ino(ino)
                                .build();
                        resourceDTOList.add(dto);
                    }catch (Exception e){
                        log.error("파일 저장 오류: {}", file.getOriginalFilename(), e);
                    }
                }
            }
            infoResourceService.deleteInfoResource(ino);
            infoResourceService.saveAll(resourceDTOList);
            log.info("저장 완료");
            Info modifiedInfo = infoService.modifyInfo(infoDTO);
            return new ResponseEntity<>(modifiedInfo, HttpStatus.OK);
        }catch (NoSuchElementException e){
            log.error("Info not found with ID: " + infoDTO.getIno(), e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{ino}")
    public ResponseEntity<Object> deleteInfo(@PathVariable Long ino) {
        infoService.deleteInfo(ino);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/important")
    public ResponseEntity<List<InfoDTO>> getInfoImportant() {
        List<InfoDTO> importantInfo = infoService.findImportantInfo();
        return new ResponseEntity<>(importantInfo, HttpStatus.OK);
    }


    @GetMapping("/read")
    public ResponseEntity<Object> getReadInfo(@RequestParam Long ino) {
        InfoDTO oneInfo = infoService.findOneInfoById(ino);
        if (oneInfo != null && oneInfo.getIno() != null) {
            return new ResponseEntity<>(oneInfo, HttpStatus.OK);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Info not found with id" + ino);
        }
    }
}
