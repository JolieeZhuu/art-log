package com.project.art_log.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

import static org.springframework.http.HttpHeaders.ACCEPT;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.HttpHeaders.ORIGIN;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

// File that allows React Application to connect the network with Spring Boot
// CORS: cross-origin resource sharing

@Configuration
public class CorsConfig {
	
	// Describes request as XMLHttpRequest (XHR)
	// Allows the front-end to retrieve any form of data through a URL
	private static final String X_REQUESTED_WITH = "X-Requested-With";
	
	@Bean // Managed by Inversion of Control (IoC) container for dependency injection and simpler management of Java objects
	public CorsFilter corsFilter() {
		var urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource(); // Maps URL patterns to CORS configurations
        var corsConfiguration = new CorsConfiguration(); // Object that developer can customize settings with
        corsConfiguration.setAllowCredentials(true); // Required; allows cookies, authorization headers, and client certificates
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173")); // Specifies domains that can make requests to the server (Vite+React)
        
        // specifies HTTP headers/methods that can be requested (allowed) and accessed (exposed)
        corsConfiguration.setAllowedHeaders(List.of("*")); // Simplified
        corsConfiguration.setAllowedMethods(List.of(GET.name(), POST.name(), PUT.name(), PATCH.name(), DELETE.name(), OPTIONS.name()));
        
        // Applies the CORS configuration to all URL patterns, through /**
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        
        return new CorsFilter(urlBasedCorsConfigurationSource);
	}
}
