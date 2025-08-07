package com.project.art_log.controllers;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.art_log.entities.Admin;
import com.project.art_log.services.AdminService;

@RestController
@RequestMapping("/admin")
@Validated
public class AdminController extends AbstractController<Admin, Integer> {	
	public AdminController(AdminService adminService) {
		super(adminService);
	}
}