package com.fooboo.controller;

import com.fooboo.exception.ResourceNotFoundException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.model.User;
import com.fooboo.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class UserController {

    private final UserRepository userRepo;

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    //  GET ALL EMPLOYEES 
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> getAllEmployees() {

        List<User> employees = userRepo.findByRole("EMPLOYEE");

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Fetched all employees successfully",
                        employees
                )
        );
    }

    //  GET EMPLOYEE BY ID 
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse> getEmployeeById(@PathVariable Long id) {

        User employee = userRepo.findById(id)
                .filter(u -> "EMPLOYEE".equals(u.getRole()))
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Employee fetched successfully",
                        employee
                )
        );                                              
    }

    //  DELETE EMPLOYEE BY ID
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<SuccessResponse> deleteEmployee(@PathVariable Long id) {

        User employee = userRepo.findById(id)
                .filter(u -> "EMPLOYEE".equals(u.getRole()))
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        userRepo.delete(employee);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "Employee deleted successfully",
                        null
                )
        );
        }
}
