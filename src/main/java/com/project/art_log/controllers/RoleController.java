package com.project.art_log.controllers;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.art_log.entities.Role;
import com.project.art_log.services.RoleService;

@RestController
@RequestMapping("/role")
@Validated
public class RoleController extends AbstractController<Role, Integer>{
	public final RoleService roleService;
	
	public RoleController(RoleService roleService) {
		super(roleService);
		this.roleService = roleService;
	}
}
