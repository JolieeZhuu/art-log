package com.project.art_log.services;

import org.springframework.stereotype.Service;

import com.project.art_log.entities.Admin;
import com.project.art_log.repos.AdminRepo;

@Service
public class AdminService extends AbstractService<Admin, Integer> {
	public AdminService(AdminRepo adminRepo) {
		super(adminRepo);
	}
}
