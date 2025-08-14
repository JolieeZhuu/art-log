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
	
	// Used native SQL because JPQL didn't seem to be working for if statements
	@Query(value = "SELECT * FROM artlog.student s WHERE LOWER(s.day) = LOWER(?1) " +
		       "AND ((?2 = 'AM' AND s.time_expected < '12:00:00') " +
		       "OR (?2 = 'PM' AND s.time_expected >= '12:00:00')) " +
		       "ORDER BY s.time_expected ASC, s.first_name ASC, s.last_name ASC", 
		       nativeQuery = true)
	List<Student> findByDayAndTimeOrderedByTimeAndName(@Param("day") String day, @Param("substring") String substring);
}