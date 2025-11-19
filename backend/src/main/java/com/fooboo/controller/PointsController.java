package com.fooboo.controller;

import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.model.PointsHistory;
import com.fooboo.model.User;
import com.fooboo.repository.UserRepository;
import com.fooboo.security.AppUserDetails;
import com.fooboo.service.PointsService;

import lombok.AllArgsConstructor;
import lombok.Data;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/points")
public class PointsController {

    private final PointsService service;
    private final UserRepository userRepo;

    public PointsController(PointsService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    @Data
    @AllArgsConstructor
    private static class PointsSummaryDto {
        private Integer totalPoints;
    }

    
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> getMyPoints(
            @AuthenticationPrincipal AppUserDetails userDetails) {

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<PointsHistory> history = service.getHistory(user);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched points history successfully",
                        history
                )
        );
    }

    
    @GetMapping("/my/summary")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> getMyPointsSummary(
            @AuthenticationPrincipal AppUserDetails userDetails) {

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PointsSummaryDto dto = new PointsSummaryDto(user.getTotalPoints());

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched total points successfully",
                        dto
                )
        );
    }
}
