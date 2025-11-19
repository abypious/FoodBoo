package com.fooboo.service;

import com.fooboo.model.Category;
import com.fooboo.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<Category> getAllCategories() {
        return repo.findAll();
    }

    public Category addCategory(Category category) {
        return repo.save(category);
    }

    public void deleteCategory(Long id) {
        repo.deleteById(id);
    }

    public boolean existsById(Long id) {
        return repo.existsById(id);
    }


    public Category getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
}
