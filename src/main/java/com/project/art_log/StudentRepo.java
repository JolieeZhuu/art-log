package com.project.art_log;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepo extends JpaRepository<Student, Integer> {
	// Spring Data JPA auto-generates query in SQL
	// Thus filtering in database rather than filtering data in back-end
	
	List<Student> findByDayIgnoreCase(String day); 
	
	/*
	query naming convention:
	- findBy: Spring understands that it must find something
	- Day (day): this is the field that Spring must find
	- IgnoreCase
	*/
	
	List<Student> findByDayIgnoreCaseAndTimeExpectedContaining(String day, String substring, Sort sort);
}