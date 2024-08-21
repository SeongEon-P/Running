package com.example.running.member.controller;

import com.example.running.teamincruit.dto.TeamRequestDTO;
import com.example.running.teamincruit.service.TeamRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private TeamRequestService teamRequestService;

    @GetMapping("/team-requests")
    public ResponseEntity<List<TeamRequestDTO>> getPendingRequests() {
        List<TeamRequestDTO> pendingRequests = teamRequestService.getAllPendingRequests();
        if (pendingRequests.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pendingRequests);
    }

    @PostMapping("/approve-team/{trno}")
    public ResponseEntity<String> approveTeam(@PathVariable Long trno) {
        try {
            // 승인 처리
            teamRequestService.approveTeam(trno);
            return ResponseEntity.ok("Team request approved successfully.");
        } catch (IllegalArgumentException e) {
            // 요청을 찾을 수 없을 때
            return ResponseEntity.status(404).body("Team request not found.");
        } catch (Exception e) {
            // 예상치 못한 오류 처리
            e.printStackTrace(); // 콘솔에 오류 로그 출력
            return ResponseEntity.status(500).body("An error occurred while approving the team request. Please try again later.");
        }
    }



    @PostMapping("/reject-team/{trno}")
    public ResponseEntity<String> rejectTeam(@PathVariable Long trno) {
        try {
            teamRequestService.rejectTeam(trno);
            return ResponseEntity.ok("Team request rejected successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Team request not found.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while rejecting the team request.");
        }
    }
}
