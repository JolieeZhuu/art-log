package com.project.art_log.services;

import org.springframework.stereotype.Service;

import com.project.art_log.entities.Role;
import com.project.art_log.repos.RoleRepo;

@Service
public class RoleService extends AbstractService<Role, Integer>{
	
	private final RoleRepo roleRepo;

	public RoleService(RoleRepo roleRepo) {
		super(roleRepo);
		this.roleRepo = roleRepo;
	}
}
