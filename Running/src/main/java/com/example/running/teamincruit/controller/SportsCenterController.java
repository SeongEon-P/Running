package com.example.running.teamincruit.controller;

import com.example.running.teamincruit.domain.SportsCenter;
import com.example.running.teamincruit.service.SportsCenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sportscenter")
public class SportsCenterController {

    @Autowired
    private SportsCenterService sportsCenterService;

    @GetMapping("/get")
    public List<SportsCenter> getSportsCenters(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int numOfRows) {

        return sportsCenterService.fetchSportsCenters(pageNo, numOfRows);
    }
}
