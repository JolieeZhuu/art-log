package com.project.art_log.entities;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "attendance") // Table name in PostgreSQL

public class Attendance {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer attendanceId; // Identified through annotations as the primary key that is auto-generated
	
	private Integer studentId;
	private Integer paymentNumber;
	private Integer classNumber;
	private LocalDate dateExpected;
	private String attendanceCheck;
	private LocalDate dateAttended;
	private LocalTime checkIn;
	private Integer hours;
	private LocalTime checkOut;
	private String paymentNotes; // About payments, will also appear in the student tables on day-page.tsx
	private String termNotes; // About the payment table, only appears in the payments-page.tsx
	private String notes;

	public Attendance() {
		
	} // equivalent to no args constructor
	
	public Attendance(Integer attendanceId, Integer studentId, Integer paymentNumber, Integer classNumber,
			LocalDate dateExpected, String attendanceCheck, LocalDate dateAttended, LocalTime checkIn, Integer hours,
			LocalTime checkOut, String paymentNotes, String termNotes, String notes) {
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
		this.paymentNotes = paymentNotes;
		this.termNotes = termNotes;
		this.notes = notes;
	}

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
	public LocalTime getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(LocalTime checkIn) {
		this.checkIn = checkIn;
	}
	public Integer getHours() {
		return hours;
	}
	public void setHours(Integer hours) {
		this.hours = hours;
	}
	public LocalTime getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(LocalTime checkOut) {
		this.checkOut = checkOut;
	}
	public String getPaymentNotes() {
		return paymentNotes;
	}
	public void setPaymentNotes(String paymentNotes) {
		this.paymentNotes = paymentNotes;
	}
	public String getTermNotes() {
		return termNotes;
	}
	public void setTermNotes(String termNotes) {
		this.termNotes = termNotes;
	}

	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
}
