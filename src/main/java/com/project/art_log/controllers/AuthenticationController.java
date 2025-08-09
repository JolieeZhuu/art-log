package com.project.art_log.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.art_log.dto.LoginUserDto;
import com.project.art_log.dto.RegisterUserDto;
import com.project.art_log.dto.VerifyUserDto;
import com.project.art_log.entities.User;
import com.project.art_log.repos.UserRepo;
import com.project.art_log.responses.LoginResponse;
import com.project.art_log.services.AuthenticationService;
import com.project.art_log.services.JwtService;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
	private final JwtService jwtService;
	private final AuthenticationService authenticationService;
	private final UserRepo userRepo;
	
	public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, UserRepo userRepo) {
		this.jwtService = jwtService;
		this.authenticationService = authenticationService;
		this.userRepo = userRepo;
	}
	
	@PostMapping("/signup")
	public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
	    try {
	        User registeredUser = authenticationService.signup(registerUserDto);
	        return ResponseEntity.ok(registeredUser);
	    } catch (RuntimeException e) {
	        return ResponseEntity.badRequest().body(e.getMessage());
	    }
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> authenticate(@RequestBody LoginUserDto loginUserDto) {
		try {
			User authenticatedUser = authenticationService.authenticate(loginUserDto);
			String jwtToken = jwtService.generateToken(authenticatedUser);
			LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
			return ResponseEntity.ok(loginResponse);
			
		} catch (RuntimeException e) {
	        return ResponseEntity.badRequest().body(e.getMessage());			
		}
	}
	
	@PostMapping("/verify")
	public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
		try {
			authenticationService.verifyUser(verifyUserDto);
			return ResponseEntity.ok("Account verified successfully.");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/resend")
	public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
		try {
			authenticationService.resendVerificationCode(email);
			return ResponseEntity.ok("Verification code sent");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/check-username")
	public ResponseEntity<?> checkUsername(@RequestParam String username) {
	    try {
	        boolean exists = userRepo.findByUsername(username).isPresent();
	        if (exists) {
	            return ResponseEntity.badRequest().body("Username already exists");
	        } else {
	            return ResponseEntity.ok("Username available");
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("Error checking username");
	    }
	}
}
