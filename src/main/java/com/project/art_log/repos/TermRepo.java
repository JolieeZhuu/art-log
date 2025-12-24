package com.project.art_log.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.art_log.entities.Term;

public interface TermRepo extends JpaRepository<Term, Integer> {
	// Special query for Term Entity
	@Query("SELECT t from Term t WHERE t.studentId = :studentId AND t.tableNum = :tableNum")
	Term findByStudentIdAndTableNum(@Param("studentId") Integer studentId, @Param("tableNum") Integer tableNum);
	
	@Modifying // only for DELETE operations
	@Query("DELETE FROM Term WHERE studentId = :studentId")
	int deleteByStudentId(@Param("studentId") Integer studentId);
}
