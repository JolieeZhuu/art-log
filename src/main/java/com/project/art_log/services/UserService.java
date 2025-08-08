package com.project.art_log.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.art_log.entities.User;
import com.project.art_log.repos.UserRepo;

@Service
public class UserService {
	private final UserRepo userRepo;
	
	public UserService(UserRepo userRepo, EmailService emailService) {
		this.userRepo = userRepo;
	}
	
	public List<User> allUsers() {
		List<User> users = new ArrayList<>();
		userRepo.findAll().forEach(users::add);
		return users;
	}
}
