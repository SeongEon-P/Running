package com.example.running.info.controller;

import com.example.running.info.domain.InfoResource;
import com.example.running.info.dto.InfoResourceDTO;
import com.example.running.info.service.InfoResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/info/files")
@Log4j2
public class InfoResourceController {
    private final InfoResourceService infoResourceService;
    private final Path fileStorageLocation = Paths.get("C:\\upload").toAbsolutePath().normalize();

    @DeleteMapping("{irno}")
    public ResponseEntity<Object> deleteFile(@PathVariable Long irno) {
        infoResourceService.deleteInfoResource(irno);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PostMapping("{ino}")
    public ResponseEntity<Object> createInfo(@PathVariable("ino") Long ino, @RequestParam("files") List<MultipartFile> files) {
        List<InfoResourceDTO> resourceDTOList = new ArrayList<InfoResourceDTO>();
        if(files != null) {
            int ord = infoResourceService.getMaxOrd(ino);
            for (MultipartFile file : files) {
                Path savePath = Paths.get("C:\\upload", file.getOriginalFilename());
                try {
                    file.transferTo(savePath);
                }catch (Exception e) {
                    e.printStackTrace();
                }
                InfoResourceDTO dto = InfoResourceDTO.builder()
                        .ir_name(file.getOriginalFilename())
                        .ir_ord(ord)
                        .ir_type(file.getContentType())
                        .ino(ino)
                        .build();
                resourceDTOList.add(dto);
                ord++;
            }
            infoResourceService.saveAll(resourceDTOList);
        }
        return  new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename){
        try {
            Path file = fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if(resource.exists() && resource.isReadable()){
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename = \"" + resource.getFilename() + "\"")
                        .body(resource);
            }else {
                throw new FileNotFoundException("Could not find or read the file: "  + filename);
            }
        }catch (MalformedURLException e) {
            throw new RuntimeException("Error: Malformed URL" + e.getMessage());
        }catch (FileNotFoundException e){
            throw  new RuntimeException("Error: " + e.getMessage());
        }
    }

}
