package com.project.art_log.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.project.art_log.repos.UserRepo;

@Configuration
public class ApplicationConfiguration {
	private final UserRepo userRepo;
	
	// Define constructor to inject userRepo
	public ApplicationConfiguration(UserRepo userRepo) {
		this.userRepo = userRepo;
	}
	
	// Define 4 beans to be injected
	@Bean
	UserDetailsService userDetailsService() {
		return username -> userRepo.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found.")); // Lambda expression
	}
	
	@Bean
	BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	} // Encodes password securely
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
	
	@Bean
	AuthenticationProvider authenticationProvider() {
	    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
	    authProvider.setPasswordEncoder(passwordEncoder());
	    
	    return authProvider;
	}
}
