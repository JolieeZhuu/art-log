package com.project.art_log;

import org.springframework.stereotype.Service;

@Service
public class AdminService extends AbstractService<Admin, Integer> {
	public AdminService(AdminRepo adminRepo) {
		super(adminRepo);
	}
}
