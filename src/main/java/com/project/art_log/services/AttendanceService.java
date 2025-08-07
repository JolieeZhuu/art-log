package com.project.art_log.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.art_log.entities.Attendance;
import com.project.art_log.repos.AttendanceRepo;

@Service
public class AttendanceService extends AbstractService<Attendance, Integer> {
	
	public final AttendanceRepo attendanceRepo; 
	
	public AttendanceService(AttendanceRepo attendanceRepo) {
		super(attendanceRepo);
		this.attendanceRepo = attendanceRepo;
	}
	
	// Attendance specific service functions
	
	public List<Attendance> getByStudentIdAndPaymentNumber(Integer studentId, Integer paymentNumber) {
		return attendanceRepo.findByStudentIdAndPaymentNumber(studentId, paymentNumber);
	}
	
	public Attendance getByPaymentNumberAndStudentIdAndClassNumber(Integer paymentNumber, Integer studentId, Integer classNumber) {
		return attendanceRepo.findByPaymentNumberAndStudentIdAndClassNumber(paymentNumber, studentId, classNumber);
	}
	
	@Transactional
	public int deleteByStudentId(Integer studentId) {
		return attendanceRepo.deleteByStudentId(studentId);
	}
	
	public Attendance getByDateExpectedAndStudentIdAndPaymentNumber(LocalDate dateExpected, Integer studentId, Integer paymentNumber) {
		return attendanceRepo.findByDateExpectedAndStudentIdAndPaymentNumber(dateExpected, studentId, paymentNumber);
	}
	
	public Attendance getFirstAbsentInThirtyDays() {
		LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
		return attendanceRepo.findFirstAbsentInThirtyDays(thirtyDaysAgo);
	}
}