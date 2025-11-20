package com.fooboo.controller;

import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.model.Booking;
import com.fooboo.model.MealTime;
import com.fooboo.model.User;
import com.fooboo.repository.UserRepository;
import com.fooboo.security.AppUserDetails;
import com.fooboo.service.BookingService;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonFormat;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;
    private final UserRepository userRepo;

    public BookingController(BookingService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingRequest {

        private Long foodItemId;

        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private MealTime mealTime;

        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate date;
    }

    // CREATE BOOKING
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> createBooking(
            @AuthenticationPrincipal AppUserDetails userDetails,
            @RequestBody BookingRequest request) {

        System.out.println("REQ → foodItemId = " + request.getFoodItemId());
        System.out.println("REQ → mealTime = " + request.getMealTime());
        System.out.println("REQ → date = " + request.getDate());

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = service.createBooking(
                user,
                request.getFoodItemId(),
                request.getMealTime(),
                request.getDate()
        );

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Booking created successfully",
                        booking
                )
        );
    }

    // MY BOOKINGS 
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> getMyBookings(
            @AuthenticationPrincipal AppUserDetails userDetails) {

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Booking> bookings = service.getUserBookings(user);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched your bookings successfully",
                        bookings
                )
        );
    }

    // ALL BOOKINGS
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> getAllBookings() {

        List<Booking> bookings = service.getAllBookings();

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched all bookings",
                        bookings
                )
        );
    }

    // CANCEL BOOKING 
    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUserDetails userDetails) {

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = service.cancelBooking(id, user);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Booking cancelled successfully",
                        booking
                )
        );
    }
}
