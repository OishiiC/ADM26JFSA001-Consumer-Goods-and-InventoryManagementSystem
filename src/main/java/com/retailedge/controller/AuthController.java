package com.retailedge.controller;

import com.retailedge.dto.request.LoginRequest;
import com.retailedge.dto.request.RegisterRequest;
import com.retailedge.dto.response.JwtResponse;
import com.retailedge.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("🔐 POST /api/auth/register - Registering new user with email: {}", registerRequest.getEmail());
        try {
            JwtResponse response = authService.registerUser(registerRequest);
            logger.info("✅ User registration successful - Email: {}, Name: {}", 
                       response.getEmail(), response.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("❌ Error during user registration - Email: {}", registerRequest.getEmail(), e);
            throw e;
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("🔐 POST /api/auth/login - Login attempt for email: {}", loginRequest.getEmail());
        try {
            JwtResponse response = authService.login(loginRequest);
            logger.info("✅ User login successful - Email: {}, Roles: {}", 
                       response.getEmail(), response.getRoles());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Error during user login - Email: {}", loginRequest.getEmail(), e);
            throw e;
        }
    }
}
