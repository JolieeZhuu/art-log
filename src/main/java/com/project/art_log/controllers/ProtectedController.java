/*package com.project.art_log.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/protect")
@RestController
public class ProtectedController {
	
	@GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        // authentication.getName() gives you the username
        // Only authenticated users can reach this endpoint
        return ResponseEntity.ok("Protected dashboard data");
    }
    
    @GetMapping("/user-profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        // Fetch user-specific data
        return ResponseEntity.ok("User profile for: " + username);
    }
}*/
