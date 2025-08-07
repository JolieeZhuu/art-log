package com.project.art_log.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.art_log.entities.Admin;

// Handles direct queries to the database
public interface AdminRepo extends JpaRepository<Admin, Integer> {

}