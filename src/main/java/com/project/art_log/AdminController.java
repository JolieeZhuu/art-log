package com.project.art_log;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@Validated
public class AdminController extends AbstractController<Admin, Integer> {	
	public AdminController(AdminService adminService) {
		super(adminService);
	}
}