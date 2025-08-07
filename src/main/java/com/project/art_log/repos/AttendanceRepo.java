package com.project.art_log.repos;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.art_log.entities.Attendance;

// Handles direct queries to the database
public interface AttendanceRepo extends JpaRepository<Attendance, Integer> {
	
	// Example of derived queries
	List<Attendance> findByStudentIdAndPaymentNumber(Integer studentId, Integer paymentNumber);
	
	// Example of JPQL
	@Query("SELECT a FROM Attendance a WHERE a.paymentNumber = :paymentNumber AND a.studentId = :studentId " + 
	"AND a.classNumber = :classNumber")
	Attendance findByPaymentNumberAndStudentIdAndClassNumber(@Param("paymentNumber") Integer paymentNumber, 
																	@Param("studentId") Integer studentId,
																	@Param("classNumber") Integer classNumber);
	
	@Modifying // only for DELETE operations
	@Query("DELETE FROM Attendance WHERE studentId = :studentId")
	int deleteByStudentId(@Param("studentId") Integer studentId);
	
	@Query("SELECT a FROM Attendance a WHERE a.dateExpected = :dateExpected AND a.studentId = :studentId " + 
	"AND a.paymentNumber = :paymentNumber")
	Attendance findByDateExpectedAndStudentIdAndPaymentNumber(@Param("dateExpected") LocalDate dateExpected,
																@Param("studentId") Integer studentId,
																@Param("paymentNumber") Integer paymentNumber);
	
	@Query("SELECT a FROM Attendance a WHERE a.dateExpected >= :thirtyDaysAgo AND a.attendanceCheck = 'Absent' " +
	" ORDER BY a.dateExpected ASC")
	Attendance findFirstAbsentInThirtyDays(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);
	
	
}