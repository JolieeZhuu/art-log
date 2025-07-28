package com.project.art_log;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
	
	// Jave persistence query language (JPQL)
	@Query("SELECT s FROM Student s WHERE LOWER(s.day) = LOWER(:day) AND s.timeExpected LIKE %:substring% " +
	       "ORDER BY CAST(SUBSTRING(s.timeExpected, 1, LOCATE(' ', s.timeExpected) - 1) AS INTEGER) ASC, " +
	       "s.firstName ASC, s.lastName ASC")
	//@Query("SELECT s FROM Student s WHERE LOWER(s.day) = LOWER(:day) AND s.timeExpected LIKE %:substring% ORDER BY s.timeExpected ASC, s.firstName ASC, s.lastName ASC")
	List<Student> findByDayAndTimeOrderedByTimeAndName(@Param("day") String day, @Param("substring") String substring);
}