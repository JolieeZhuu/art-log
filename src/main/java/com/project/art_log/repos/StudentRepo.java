package com.project.art_log.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.art_log.entities.Student;

// Handles direct queries to the database
public interface StudentRepo extends JpaRepository<Student, Integer> {
	
	// Example of spring data JPA query methods (derived queries)
	// Typically used for simple requests from DB
	/*
	 * Has a naming convention:
	 * findBy: Spring understands that it must find Student entities (since specified by JPA repository)
	 * Day (day): specifies what is required to be found
	 * IgnoreCase: ignores case sensitivity
	 */
	List<Student> findByDayIgnoreCase(String day); 
	
	// Example of Java persistence query language (JPQL); heavily inspired by SQL
	@Query("SELECT s FROM Student s WHERE LOWER(s.day) = LOWER(:day) " +
		       "ORDER BY s.timeExpected ASC, s.firstName ASC, s.lastName ASC")
	List<Student> findByDayAndTimeOrderedByTimeAndName(@Param("day") String day);
}