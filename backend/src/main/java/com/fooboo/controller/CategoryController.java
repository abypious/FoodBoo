package com.fooboo.controller;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.model.Category;
import com.fooboo.service.CategoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    // GET ALL
    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<SuccessResponse> getAllCategories() {

        List<Category> categories = service.getAllCategories();

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Categories fetched successfully",
                        categories
                )
        );
    }

    // CREATE CATEGORY
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> addCategory(@RequestBody Category category) {

        if (category.getName() == null || category.getName().isBlank()) {
            throw new BadRequestException("Category name cannot be empty");
        }

        if (category.getImageUrl() == null || category.getImageUrl().isBlank()) {
            throw new BadRequestException("Category image is required");
        }

        // If no image provided, set a default placeholder
        if (category.getImageUrl() == null || category.getImageUrl().isBlank()) {
            category.setImageUrl("https://placehold.co/600x400?text=Category");
        }

        Category saved = service.addCategory(category);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Category added successfully",
                        saved
                )
        );
    }

    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> deleteCategory(@PathVariable Long id) {

        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }

        service.deleteCategory(id);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Category deleted successfully",
                        null
                )
        );
    }
}

