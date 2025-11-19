package com.fooboo.controller;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.model.Review;
import com.fooboo.model.User;
import com.fooboo.repository.UserRepository;
import com.fooboo.security.AppUserDetails;
import com.fooboo.service.ReviewService;

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

    //  ADD REVIEW 
    @PostMapping("/{foodId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> addReview(
            @PathVariable Long foodId,
            @RequestBody Review review,
            @AuthenticationPrincipal AppUserDetails userDetails) {

        if (review.getComment() == null || review.getComment().isBlank()) {
            throw new BadRequestException("Review comment cannot be empty");
        }

        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review saved = service.addReview(user, foodId, review);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Review added successfully",
                        saved
                )
        );
    }

    //  UPDATE REVIEW 
    @PutMapping("/{reviewId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<SuccessResponse> updateReview(
            @PathVariable Long reviewId,
            @RequestBody Review updatedData,
            @AuthenticationPrincipal AppUserDetails userDetails) {

        if (updatedData.getComment() == null || updatedData.getComment().isBlank()) {
            throw new BadRequestException("Review comment cannot be empty");
        }

        if (updatedData.getRating() == null || updatedData.getRating() < 1 || updatedData.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review saved = service.updateReview(reviewId, user, updatedData);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Review updated successfully",
                        saved
                )
        );
    }

    //  DELETE REVIEW 
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

    //  FOOD REVIEWS 
    @GetMapping("/food/{foodId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
    public ResponseEntity<SuccessResponse> getFoodReviews(@PathVariable Long foodId) {

        List<Review> reviews = service.getReviewsForFood(foodId);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched reviews for food successfully",
                        reviews
                )
        );
    }

    //  MY REVIEWS 
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('EMPLOYEE')")
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

    //  ALL REVIEWS
    @GetMapping
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
