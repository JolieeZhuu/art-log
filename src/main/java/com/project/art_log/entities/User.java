package com.project.art_log.entities;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User implements UserDetails { // integrates with Spring Security through implementation
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userId;
	@Column(unique = true, nullable = false)
	private String username;
	@Column(unique = true, nullable = false)
	private String email;
	@Column(nullable = false)
	private String password;
	private boolean enabled;
	@Column(name = "verification_code")
	private String verificationCode;
	@Column(name = "verification_expiration")
	private LocalDateTime verificationCodeExpiresAt;
	
	public User() {
		
	} // Empty constructor

	public User(String username, String email, String password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of();
	} // Returns user's role lists; empty because no roles for this app
	
	@Override
	public boolean isAccountNonExpired() {
		return true; // Not functional
	}
	
	@Override
	public boolean isAccountNonLocked() {
		return true; // Not functional
	}
	
	@Override
	public boolean isCredentialsNonExpired() {
		return true; // NOt functional
	}
	
	@Override
	public boolean isEnabled() {
		return enabled;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setId(Integer userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getVerificationCode() {
		return verificationCode;
	}

	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}

	public LocalDateTime getVerificationCodeExpiresAt() {
		return verificationCodeExpiresAt;
	}

	public void setVerificationCodeExpiresAt(LocalDateTime verificationCodeExpiresAt) {
		this.verificationCodeExpiresAt = verificationCodeExpiresAt;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	
}
