package com.project.art_log;

import java.util.List;

import org.springframework.stereotype.Service;

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
}