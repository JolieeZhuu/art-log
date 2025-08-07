package com.project.art_log.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.art_log.entities.Attendance;
import com.project.art_log.services.AttendanceService;

@RestController
@RequestMapping("/attendance")
@Validated
public class AttendanceController extends AbstractController<Attendance, Integer>{
	
	public final AttendanceService attendanceService;
	
	public AttendanceController(AttendanceService attendanceService) {
		super(attendanceService);
		this.attendanceService = attendanceService;
	}
	
	// Attendance specific controller functions
	
	@GetMapping("/student/{studentId}/{paymentNumber}")
	public ResponseEntity<List<Attendance>> getByStudentId(@PathVariable("studentId") Integer studentId, 
														   @PathVariable("paymentNumber") Integer paymentNumber) {
		System.out.println("getting by student id and payment number works");
		return ResponseEntity.ok().body(attendanceService.getByStudentIdAndPaymentNumber(studentId, paymentNumber));
	}
	
	@GetMapping("/class/{paymentNumber}/{studentId}/{classNumber}")
	public ResponseEntity<Attendance> getLastClass(@PathVariable("paymentNumber") Integer paymentNumber, 
															@PathVariable("studentId") Integer studentId, 
															@PathVariable("classNumber") Integer classNumber) {
		System.out.println("getting by payment number, student id, and class number works");
		return ResponseEntity.ok().body(attendanceService.getByPaymentNumberAndStudentIdAndClassNumber(paymentNumber, studentId, classNumber));
	}
	
	@DeleteMapping("/student/{studentId}")
	public ResponseEntity<String> deleteByStudentId(@PathVariable("studentId") Integer studentId) {
		System.out.println("deleting all by student id works");
		int deletedCount = attendanceService.deleteByStudentId(studentId);
        return ResponseEntity.ok().body("Deleted " + deletedCount + " attendance records from student");
	}
	
	@GetMapping("/date")
	public ResponseEntity<Attendance> getClassByDate(@RequestParam("dateExpected") LocalDate dateExpected,
													@RequestParam("studentId") Integer studentId,
													@RequestParam("paymentNumber") Integer paymentNumber) {
		System.out.println("getting by date expected, student id, and payment number works");
		return ResponseEntity.ok().body(attendanceService.getByDateExpectedAndStudentIdAndPaymentNumber(dateExpected, studentId, paymentNumber));
	}
	
	@GetMapping("/absent")
	public ResponseEntity<Attendance> getFirstAbsent() {
		System.out.println("getting first absence within thirty days works");
		return ResponseEntity.ok().body(attendanceService.getFirstAbsentInThirtyDays());
	}
}