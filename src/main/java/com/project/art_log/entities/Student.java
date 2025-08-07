package com.project.art_log.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "student") // Table name in PostgreSQL

public class Student {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer studentId; // Identified through annotations as the primary key that is auto-generated
	
    private String firstName;
    private String lastName;
    private String classId;
    private String day;
    private String phoneNumber;
	private String timeExpected;
	private String paymentNotes;
	private String notes;
    private Integer paymentNumber;
	private Integer classNumber;
	private Integer totalClasses;
    
	public Student() {
		
	} // equivalent to no args constructor
	
	public Student(Integer studentId, String firstName, String lastName, String classId, String day, String phoneNumber,
			Integer paymentNumber, Integer classNumber, String notes, String paymentNotes) {
		super();
		this.studentId = studentId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.classId = classId;
		this.day = day;
		this.phoneNumber = phoneNumber;
		this.paymentNumber = paymentNumber;
		this.classNumber = classNumber;
		this.notes = notes;
		this.paymentNotes = paymentNotes;
	} // equivalent to all args constructor
    
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getClassId() {
		return classId;
	}
	public void setClassId(String classId) {
		this.classId = classId;
	}
	public String getDay() {
		return day;
	}
	public void setDay(String day) {
		this.day = day;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getTimeExpected() {
		return timeExpected;
	}
	public void setTimeExpected(String timeExpected) {
		this.timeExpected = timeExpected;
	}	
	public String getPaymentNotes() {
		return paymentNotes;
	}
	public void setPaymentNotes(String paymentNotes) {
		this.paymentNotes = paymentNotes;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
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
	public Integer getTotalClasses() {
		return totalClasses;
	}
	public void setTotalClasses(Integer totalClasses) {
		this.totalClasses = totalClasses;
	}
}