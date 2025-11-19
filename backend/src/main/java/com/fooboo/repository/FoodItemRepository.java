package com.fooboo.repository;

import com.fooboo.model.FoodItem;
import com.fooboo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByCategoryAndAvailableTrue(Category category);
}
