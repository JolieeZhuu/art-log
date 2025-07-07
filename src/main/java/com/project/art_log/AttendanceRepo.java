package com.project.art_log;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepo extends JpaRepository<Attendance, Integer> {
	
	List<Attendance> findByStudentIdAndPaymentNumber(Integer studentId, Integer paymentNumber);

}