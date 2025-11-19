package com.fooboo.service;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.model.FoodItem;
import com.fooboo.model.Review;
import com.fooboo.model.User;
import com.fooboo.repository.FoodItemRepository;
import com.fooboo.repository.ReviewRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final FoodItemRepository foodRepo;
    private final PointsService pointsService;

    public ReviewService(ReviewRepository reviewRepo,
                         FoodItemRepository foodRepo,
                         PointsService pointsService) {

        this.reviewRepo = reviewRepo;
        this.foodRepo = foodRepo;
        this.pointsService = pointsService;
    }

    public Review addReview(User user, Long foodId, Review review) {

        FoodItem food = foodRepo.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found"));

        boolean alreadyReviewed = reviewRepo.findByUserAndFoodItem(user, food).isPresent();
        if (alreadyReviewed) {
            throw new BadRequestException("You have already reviewed this food item");
        }

        review.setUser(user);
        review.setFoodItem(food);

        Review saved = reviewRepo.save(review);

        pointsService.addPoints(user, 5, "Added review for " + food.getName());

        return saved;
    }

    public Review updateReview(Long reviewId, User user, Review updatedReview) {

        Review existing = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot edit another user's review");
        }

        existing.setRating(updatedReview.getRating());
        existing.setComment(updatedReview.getComment());

        Review saved = reviewRepo.save(existing);

        return saved;
    }

    // DELETE REVIEW
    public void deleteReview(Long reviewId, User user) {

        Review existing = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        //  Only owner can delete
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot delete another user's review");
        }

        reviewRepo.delete(existing);
    }

    // GET REVIEWS BY FOOD
    public List<Review> getReviewsForFood(Long foodId) {
        return reviewRepo.findByFoodItemId(foodId);
    }

    // GET ALL REVIEWS (Admin)
    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    // GET REVIEWS BY USER
    public List<Review> getReviewsByUser(User user) {
        return reviewRepo.findByUser(user);
    }
}
