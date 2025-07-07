package com.project.art_log;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/attendance")
@Validated
public class AttendanceController extends AbstractController<Attendance, Integer>{
	
	public final AttendanceService attendanceService;
	
	public AttendanceController(AttendanceService attendanceService) {
		super(attendanceService);
		this.attendanceService = attendanceService;
	}
	
	@GetMapping("/student/{studentId}/{paymentNumber}")
	public ResponseEntity<List<Attendance>> getByStudentId(@PathVariable("studentId") Integer studentId, 
														   @PathVariable("paymentNumber") Integer paymentNumber) {
		System.out.println("getting by student id and payment number works");
		return ResponseEntity.ok().body(attendanceService.getByStudentIdAndPaymentNumber(studentId, paymentNumber));
	}
}