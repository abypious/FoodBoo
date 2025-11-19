package com.fooboo.service;

import com.fooboo.model.*;
import com.fooboo.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FoodService {

    private final FoodItemRepository foodRepo;
    private final CategoryRepository categoryRepo;

    public FoodService(FoodItemRepository foodRepo, CategoryRepository categoryRepo) {
        this.foodRepo = foodRepo;
        this.categoryRepo = categoryRepo;
    }

    public List<FoodItem> getAll() {
        return foodRepo.findAll();
    }

    public List<FoodItem> getAvailableByCategory(Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return foodRepo.findByCategoryAndAvailableTrue(category);
    }

    public FoodItem addFood(FoodItem item) {
        Category category = categoryRepo.findById(item.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Invalid category"));
        item.setCategory(category);
        return foodRepo.save(item);
    }

    public FoodItem updateAvailability(Long id, boolean available) {
        FoodItem item = foodRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found"));
        item.setAvailable(available);
        return foodRepo.save(item);
    }

    public void deleteFood(Long id) {
        foodRepo.deleteById(id);
    }

    public boolean exists(Long id) {
        return foodRepo.existsById(id);
    }

    public FoodItem findById(Long id) {
        return foodRepo.findById(id).orElse(null);
    }
}
