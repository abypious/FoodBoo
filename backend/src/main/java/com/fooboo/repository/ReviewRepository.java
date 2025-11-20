package com.fooboo.repository;

import com.fooboo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByBookingId(Long bookingId);

    List<Review> findByBooking_FoodItem_Id(Long foodId);

    List<Review> findByUser_Id(Long userId);
}
