package com.fooboo.controller;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.model.Review;
import com.fooboo.model.User;
import com.fooboo.repository.UserRepository;
import com.fooboo.security.AppUserDetails;
import com.fooboo.service.ReviewService;

import lombok.Data;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;
    private final UserRepository userRepo;

    public ReviewController(ReviewService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    @Data
    public static class ReviewRequest {
        private Integer rating;
        private String comment;
    }

    // ADD OR UPDATE REVIEW FOR A BOOKING
    @PostMapping("/{bookingId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> addOrUpdateReview(
            @PathVariable Long bookingId,
            @RequestBody ReviewRequest req,
            @AuthenticationPrincipal AppUserDetails userDetails) {

        if (req.getComment() == null || req.getComment().isBlank()) {
            throw new BadRequestException("Review comment cannot be empty");
        }

        if (req.getRating() == null || req.getRating() < 1 || req.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review saved = service.addOrUpdateReview(user, bookingId, req.getRating(), req.getComment());

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Review saved successfully",
                        saved
                )
        );
    }

    // GET REVIEW FOR A BOOKING
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> getReviewForBooking(
            @PathVariable Long bookingId) {

        Review review = service.getReviewForBooking(bookingId);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched review for booking",
                        review
                )
        );
    }

    // FOOD-WISE REVIEWS
    @GetMapping("/food/{foodId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public ResponseEntity<SuccessResponse> getReviewsForFood(
            @PathVariable Long foodId) {

        List<Review> reviews = service.getReviewsForFood(foodId);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched reviews for food",
                        reviews
                )
        );
    }

    // MY REVIEWS
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> getMyReviews(
            @AuthenticationPrincipal AppUserDetails userDetails) {

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Review> reviews = service.getReviewsByUser(user);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched your reviews successfully",
                        reviews
                )
        );
    }

    // DELETE REVIEW
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal AppUserDetails userDetails) {

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        service.deleteReview(reviewId, user);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Review deleted successfully",
                        null
                )
        );
    }

    // GET ALL REVIEWS - ADMIN ONLY
        @GetMapping("")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<SuccessResponse> getAllReviews() {

        List<Review> reviews = service.getAllReviews();

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched all reviews successfully",
                        reviews
                )
        );
        }

}
