package com.project.art_log;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AttendanceRepo extends JpaRepository<Attendance, Integer> {
	
	List<Attendance> findByStudentIdAndPaymentNumber(Integer studentId, Integer paymentNumber);
	
	@Query("SELECT a FROM Attendance a WHERE a.paymentNumber = :paymentNumber AND a.studentId = :studentId " + 
	"AND a.classNumber = :classNumber")
	Attendance findByPaymentNumberAndStudentIdAndClassNumber(@Param("paymentNumber") Integer paymentNumber, 
																	@Param("studentId") Integer studentId,
																	@Param("classNumber") Integer classNumber);
	
	@Modifying // only for DELETE operations
	@Query("DELETE FROM Attendance WHERE studentId = :studentId")
	int deleteByStudentId(@Param("studentId") Integer studentId);
}