package com.example.running.info.service;

import com.example.running.info.domain.Info;
import com.example.running.info.domain.InfoResource;
import com.example.running.info.dto.InfoDTO;
import com.example.running.info.dto.InfoResourceDTO;
import com.example.running.info.repository.InfoRepository;
import com.example.running.info.repository.InfoResourceRepository;
import com.example.running.member.domain.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class InfoServiceImpl implements InfoService {
    private final InfoRepository infoRepository;
    private final ModelMapper modelMapper;
    private final InfoResourceRepository infoResourceRepository;

    @Override
    public List<InfoDTO> findAllInfo() {
        List<Info> infos = infoRepository.findAll();
        List<InfoDTO> infoDTOList = infos.stream().map(info -> modelMapper.map(info, InfoDTO.class)).collect(Collectors.toList());
        return infoDTOList;
    }

    @Override
    public InfoDTO addInfo(InfoDTO infoDTO) {
        Info info = Info.builder()
                .i_content(infoDTO.getI_content())
                .i_title(infoDTO.getI_title())
                .i_image(infoDTO.getI_image())
                .writer(infoDTO.getWriter())
                .build();
        Info savedInfo = infoRepository.save(info);
        return modelMapper.map(savedInfo, InfoDTO.class);
    }

    @Override
    public InfoDTO findOneInfoById(Long ino) {
        Optional<Info> result = infoRepository.findById(ino);
        Info info = result.orElseThrow();
        Set<InfoResource> irList = info.getInfoResourceSet();
        List<InfoResourceDTO> irDtoList = new ArrayList<>();
        for (InfoResource infoResource : irList) {
            irDtoList.add(InfoResourceDTO.builder()
                            .irno(infoResource.getIrno())
                            .file_size(infoResource.getFile_size())
                            .ir_name(infoResource.getIr_name())
                            .ir_ord(infoResource.getIr_ord())
                            .ir_path(infoResource.getIr_path())
                            .ir_type(infoResource.getIr_type())
                            .ino(infoResource.getInfo().getIno())
                    .build());
        }
        InfoDTO infoListDTO = InfoDTO.builder()
                .ino(info.getIno())
                .i_title(info.getI_title())
                .i_image(info.getI_image())
                .i_content(info.getI_content())
                .writer(info.getWriter())
                .regDate(info.getRegDate())
                .info_resource(irDtoList)
                .build();
        return infoListDTO;
    }

    @Override
    public void deleteInfo(Long ino) {
        infoRepository.deleteById(ino);
        infoResourceRepository.deleteById(ino);
    }

    @Override
    public Info modifyInfo(InfoDTO infoDTO) {
        Optional<Info> result = infoRepository.findById(infoDTO.getIno());
        if(!result.isPresent()) {
            throw  new NoSuchElementException("Info Not Found with ID:" + infoDTO.getIno());
        }
        Info info = result.get();
        info.changeInfo(
                infoDTO.getI_title(),
                infoDTO.getI_content(),
                infoDTO.getI_image(),
                Member.builder().mid(infoDTO.getWriter()).build()
        );
        Info savedInfo = infoRepository.save(info);
        return savedInfo;
    }

    @Override
    public List<InfoDTO> findLatestInfo() {
        List<Info> infos = infoRepository.findTop5ByOrderByRegDateDesc();
        return infos.stream()
                .map(info -> modelMapper.map(info, InfoDTO.class))
                .collect(Collectors.toList());
    }
}
