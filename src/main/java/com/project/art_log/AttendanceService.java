package com.project.art_log;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AttendanceService extends AbstractService<Attendance, Integer> {
	
	public final AttendanceRepo attendanceRepo; 
	
	public AttendanceService(AttendanceRepo attendanceRepo) {
		super(attendanceRepo);
		this.attendanceRepo = attendanceRepo;
	}
	
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
	
	public Attendance getByDateExpectedAndStudentIdAndPaymentNumber(String dateExpected, Integer studentId, Integer paymentNumber) {
		return attendanceRepo.findByDateExpectedAndStudentIdAndPaymentNumber(dateExpected, studentId, paymentNumber);
	}
}