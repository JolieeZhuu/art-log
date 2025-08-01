package com.project.art_log;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "attendance")

public class Attendance {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	
	private Integer attendanceId;
	private Integer studentId;
	private Integer paymentNumber;
	private Integer classNumber;
	private LocalDate dateExpected;
	private String attendanceCheck;
	private LocalDate dateAttended;
	private String checkIn;
	private Integer hours;
	private String checkOut;
	private String notes;

	public Attendance() {
		
	} // equivalent to no args constructor
	
	public Attendance(Integer attendanceId, Integer studentId, Integer paymentNumber, Integer classNumber,
			LocalDate dateExpected, String attendanceCheck, LocalDate dateAttended, String checkIn, Integer hours,
			String checkOut) {
		super();
		this.attendanceId = attendanceId;
		this.studentId = studentId;
		this.paymentNumber = paymentNumber;
		this.classNumber = classNumber;
		this.dateExpected = dateExpected;
		this.attendanceCheck = attendanceCheck;
		this.dateAttended = dateAttended;
		this.checkIn = checkIn;
		this.hours = hours;
		this.checkOut = checkOut;
	} // equivalent to all args constructor
	
	public Integer getAttendanceId() {
		return attendanceId;
	}
	
	public void setAttendanceId(Integer attendanceId) {
		this.attendanceId = attendanceId;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public Integer getPaymentNumber() {
		return paymentNumber;
	}
	public void setPaymentNumber(Integer paymentNumber) {
		this.paymentNumber = paymentNumber;
	}
	public Integer getClassNumber() {
		return classNumber;
	}
	public void setClassNumber(Integer classNumber) {
		this.classNumber = classNumber;
	}
	public LocalDate getDateExpected() {
		return dateExpected;
	}
	public void setDateExpected(LocalDate dateExpected) {
		this.dateExpected = dateExpected;
	}
	public String getAttendanceCheck() {
		return attendanceCheck;
	}
	public void setAttendanceCheck(String attendanceCheck) {
		this.attendanceCheck = attendanceCheck;
	}
	public LocalDate getDateAttended() {
		return dateAttended;
	}
	public void setDateAttended(LocalDate dateAttended) {
		this.dateAttended = dateAttended;
	}
	public String getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(String checkIn) {
		this.checkIn = checkIn;
	}
	public Integer getHours() {
		return hours;
	}
	public void setHours(Integer hours) {
		this.hours = hours;
	}
	public String getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(String checkOut) {
		this.checkOut = checkOut;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
}
