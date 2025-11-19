package com.fooboo.controller;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.model.FoodItem;
import com.fooboo.service.FoodService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final FoodService service;

    public FoodController(FoodService service) {
        this.service = service;
    }

    // GET ALL FOODS (ADMIN + EMPLOYEE)
    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<SuccessResponse> getAllFoods() {

        List<FoodItem> all = service.getAll();

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "All foods fetched successfully",
                        all
                )
        );
    }

    // GET FOODS BY CATEGORY
    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<SuccessResponse> getByCategory(@PathVariable Long categoryId) {

        List<FoodItem> items = service.getAvailableByCategory(categoryId);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Foods fetched successfully",
                        items
                )
        );
    }

    // ADD FOOD
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> addFood(@RequestBody FoodItem foodItem) {

        if (foodItem.getName() == null || foodItem.getName().isBlank()) {
            throw new BadRequestException("Food name cannot be empty");
        }

        if (foodItem.getCategory() == null || foodItem.getCategory().getId() == null) {
            throw new BadRequestException("Category ID is required");
        }

        if (foodItem.getImageUrls() == null || foodItem.getImageUrls().isEmpty()) {
            throw new BadRequestException("At least one image is required");
        }


        FoodItem saved = service.addFood(foodItem);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Food added successfully",
                        saved
                )
        );
    }

    // UPDATE AVAILABILITY
    @PutMapping("/availability/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean available) {

        boolean exists = service.exists(id);

        if (!exists) {
            throw new ResourceNotFoundException("Food item not found with ID: " + id);
        }

        FoodItem updated = service.updateAvailability(id, available);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Food availability updated successfully",
                        updated
                )
        );
    }

    // DELETE FOOD
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> deleteFood(@PathVariable Long id) {

        boolean exists = service.exists(id);

        if (!exists) {
            throw new ResourceNotFoundException("Food item not found with ID: " + id);
        }

        service.deleteFood(id);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Food item deleted successfully",
                        null
                )
        );
    }


    // UPDATE FOOD
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> updateFood(
            @PathVariable Long id,
            @RequestBody FoodItem foodDetails) {

        FoodItem existing = service.findById(id);

        if (existing == null) {
            throw new ResourceNotFoundException("Food item not found with ID: " + id);
        }

        if (foodDetails.getName() == null || foodDetails.getName().isBlank()) {
            throw new BadRequestException("Food name cannot be empty");
        }

        if (foodDetails.getCategory() == null || foodDetails.getCategory().getId() == null) {
            throw new BadRequestException("Category ID is required");
        }

        if (foodDetails.getImageUrls() == null || foodDetails.getImageUrls().isEmpty()) {
            throw new BadRequestException("At least one image is required");
        }

        // Update fields
        existing.setName(foodDetails.getName());
        existing.setDescription(foodDetails.getDescription());
        existing.setCategory(foodDetails.getCategory());
        existing.setImageUrls(foodDetails.getImageUrls());
        existing.setAvailable(foodDetails.getAvailable() != null ? foodDetails.getAvailable() : existing.getAvailable());

        FoodItem updated = service.addFood(existing); // save()

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Food updated successfully",
                        updated
                )
        );
    }

    // GET FOOD BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<SuccessResponse> getFoodById(@PathVariable Long id) {

        FoodItem item = service.findById(id);

        if (item == null) {
            throw new ResourceNotFoundException("Food not found with ID: " + id);
        }

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Food fetched successfully",
                        item
                )
        );
    }
}
