package com.fooboo.service;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.model.Booking;
import com.fooboo.model.Review;
import com.fooboo.model.User;
import com.fooboo.repository.BookingRepository;
import com.fooboo.repository.ReviewRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final BookingRepository bookingRepo;
    private final PointsService pointsService;

    public ReviewService(ReviewRepository reviewRepo,
                         BookingRepository bookingRepo,
                         PointsService pointsService) {

        this.reviewRepo = reviewRepo;
        this.bookingRepo = bookingRepo;
        this.pointsService = pointsService;
    }

    public Review addOrUpdateReview(User user, Long bookingId, int rating, String comment) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot review another user's booking");
        }

        if (!"COMPLETED".equals(booking.getStatus())) {
            throw new BadRequestException("You can only review completed bookings");
        }

        Review review = reviewRepo.findByBookingId(bookingId)
                .orElse(new Review());

        boolean isNew = (review.getId() == null);

        review.setBooking(booking);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);

        Review saved = reviewRepo.save(review);

        if (isNew) {
            pointsService.addPoints(user, 5, "Added review for " + booking.getFoodItem().getName());
        }

        return saved;
    }

    public Review getReviewForBooking(Long bookingId) {
        return reviewRepo.findByBookingId(bookingId)
                .orElse(null);
    }

    public List<Review> getReviewsForFood(Long foodId) {
        return reviewRepo.findByBooking_FoodItem_Id(foodId);
    }

    public List<Review> getReviewsByUser(User user) {
        return reviewRepo.findByUser_Id(user.getId());
    }

    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    public void deleteReview(Long reviewId, User user) {

        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot delete another user's review");
        }

        reviewRepo.delete(review);
    }
}
