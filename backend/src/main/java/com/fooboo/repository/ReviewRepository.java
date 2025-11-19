package com.fooboo.repository;

import com.fooboo.model.FoodItem;
import com.fooboo.model.Review;
import com.fooboo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByFoodItemId(Long foodId);
    List<Review> findByUser(User user);
    Optional<Review> findByUserAndFoodItem(User user, FoodItem foodItem);
}
