package com.example.running.info.service;

import com.example.running.info.domain.InfoResource;
import com.example.running.info.dto.InfoResourceDTO;
import com.example.running.info.repository.InfoRepository;
import com.example.running.info.repository.InfoResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class InfoResourceServiceImpl implements InfoResourceService {
    private final InfoResourceRepository infoResourceRepository;
    private final ModelMapper modelMapper;
    private final InfoRepository infoRepository;

    @Override
    public void saveAll(List<InfoResourceDTO> resourceDTOList) {
        List<InfoResource> resourceList =
                resourceDTOList.stream().map
                        (dto -> modelMapper.map(dto, InfoResource.class)
                ).collect(Collectors.toList());
        infoResourceRepository.saveAll(resourceList);
    }

    @Override
    public void deleteInfoResource(Long irno) {
        infoResourceRepository.deleteById(irno);
    }

    @Override
    public int getMaxOrd(Long ino) {
        return infoResourceRepository.getMaxOrd(ino);
    }
}
