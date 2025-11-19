package com.fooboo.controller;

import com.fooboo.exception.BadRequestException;
import com.fooboo.exception.UnauthorizedException;
import com.fooboo.exception.SuccessResponse;
import com.fooboo.repository.UserRepository;
import com.fooboo.security.AppUserDetails;
import com.fooboo.security.JwtUtil;
import com.fooboo.model.User;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    //  REGISTER 
    @PostMapping("/register")
    public ResponseEntity<SuccessResponse> register(@Valid @RequestBody RegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole(req.getRole() == null ? "EMPLOYEE" : req.getRole());

        userRepo.save(u);

        return ResponseEntity.ok(
                new SuccessResponse(
                        LocalDateTime.now(),
                        200,
                        "User registered successfully",
                        u
                )
        );
    }

    //  LOGIN 
    @PostMapping("/login")
    public ResponseEntity<SuccessResponse> login(@Valid @RequestBody AuthRequest req) {

        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            AppUserDetails ud = (AppUserDetails) auth.getPrincipal();
            String token = jwtUtil.generateToken(ud);

            return ResponseEntity.ok(
                    new SuccessResponse(
                            LocalDateTime.now(),
                            200,
                            "Login successful",
                            new AuthResponse(token)
                    )
            );

        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        } catch (Exception ex) {
            throw new UnauthorizedException("Authentication failed: " + ex.getMessage());
        }
    }

    // DTO

    @Data
    static class RegisterRequest {

        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String role;
    }

    @Data
    static class AuthRequest {

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    static class AuthResponse {
        private final String token;
    }
}
