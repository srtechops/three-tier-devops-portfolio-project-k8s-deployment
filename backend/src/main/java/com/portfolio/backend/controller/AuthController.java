package com.portfolio.backend.controller;

import com.portfolio.backend.dto.LoginRequest;
import com.portfolio.backend.dto.TokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.auth.username}")
    private String adminUsername;

    @Value("${app.auth.password}")
    private String adminPassword;

    @Value("${app.auth.token}")
    private String adminToken;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (adminUsername.equals(loginRequest.getUsername()) && adminPassword.equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(new TokenResponse(adminToken));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
