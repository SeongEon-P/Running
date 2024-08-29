package com.example.running.teamincruit.service;

import com.example.running.teamincruit.domain.SportsCenter;

import java.util.List;

public interface SportsCenterService {
    List<SportsCenter> fetchSportsCenters(int pageNo, int numOfRows);
}
