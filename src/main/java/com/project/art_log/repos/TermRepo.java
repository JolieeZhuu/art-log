package com.project.art_log.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.art_log.entities.Term;

public interface TermRepo extends JpaRepository<Term, Integer> {
	// Nothing for now, since no special queries
}
