package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.Incruit;
import com.example.running.teamincruit.repository.IncruitRepository;
import com.example.running.teamincruit.dto.IncruitDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class IncruitServiceImpl implements IncruitService {
    private final IncruitRepository incruitRepository;
    private final ModelMapper modelMapper;

    @Override
    public Long registerIncruit(IncruitDTO incruitDTO) {

        try {
            Incruit incruit = modelMapper.map(incruitDTO, Incruit.class);

            Long ino = incruitRepository.save(incruit).getIno();

            log.info("등록된 모집 ino: " + ino);

            return ino;
        } catch (Exception e) {
            e.printStackTrace();
            log.error("모집 등록 에러: " + e.getMessage(), e);
            return null;
        }
    }

    @Override
    public IncruitDTO getIncruit(Long ino) {

        Optional<Incruit> incruit = incruitRepository.findById(ino);

        if (incruit.isPresent()) {
            IncruitDTO incruitDTO = modelMapper.map(incruit.get(), IncruitDTO.class);
            return incruitDTO;
        } else {
            log.info("ino에 해당하는 모집이 없습니다." + ino);
            return null;
        }
    }

    @Override
    public void modifyIncruit(IncruitDTO incruitDTO) {
        Incruit incruit = modelMapper.map(incruitDTO, Incruit.class);
        incruitRepository.save(incruit);
    }

    @Override
    public void removeIncruit(Long ino) {
        incruitRepository.deleteById(ino);
    }


    @Override
    public List<IncruitDTO> getAllIncruit() {
        List<Incruit> incruits = incruitRepository.findAll();
        return incruits.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private IncruitDTO convertToDto(Incruit incruit) {
        return IncruitDTO.builder()
                .ino(incruit.getIno())
                .icontent(incruit.getIcontent())
                .ititle(incruit.getItitle())
                .iwriter(incruit.getIwriter())
                .regDate(incruit.getRegDate())
                .iviews(incruit.getIviews())
                .teamName(incruit.getTeam().getTeamName())
                .teamMemberCount(incruit.getTeamMemberCount())
                .teamStartdate(incruit.getTeamStartdate())
                .teamExplain(incruit.getTeamExplain())
                .teamLeader(incruit.getTeamLeader())
                .teamLogo(incruit.getTeamLogo())
                .teamLevel(incruit.getTeamLevel())
                .teamFromPro(incruit.getTeamFromPro())
                .build();
    }

}
