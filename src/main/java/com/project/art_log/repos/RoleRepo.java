package com.project.art_log.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.art_log.entities.Role;

public interface RoleRepo extends JpaRepository<Role, Integer>{
	// no specific queries
}
