package com.project.art_log.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.art_log.entities.User;

public interface UserRepo extends JpaRepository<User, Integer> {
	Optional<User> findByEmail(String email);
	Optional<User> findByVerificationCode(String verificationCode);
}