package com.project.art_log.entities;

import java.time.LocalTime;

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
	private LocalTime timeExpected;
	private String generalNotes;
    private Integer currTable;
	private Integer currClass;
	private Double classHours;
    
	public Student() {
		
	} // equivalent to no args constructor
	    
	public Student(Integer studentId, String firstName, String lastName, String classId, String day, String phoneNumber,
			LocalTime timeExpected, String generalNotes, Integer currTable, Integer currClass, Double classHours) {
		super();
		this.studentId = studentId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.classId = classId;
		this.day = day;
		this.phoneNumber = phoneNumber;
		this.timeExpected = timeExpected;
		this.generalNotes = generalNotes;
		this.currTable = currTable;
		this.currClass = currClass;
		this.classHours = classHours;
	}

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
	public LocalTime getTimeExpected() {
		return timeExpected;
	}
	public void setTimeExpected(LocalTime timeExpected) {
		this.timeExpected = timeExpected;
	}
	public String getGeneralNotes() {
		return generalNotes;
	}
	public void setGeneralNotes(String generalNotes) {
		this.generalNotes = generalNotes;
	}
    public Integer getCurrTable() {
		return currTable;
	}
	public void setCurrTable(Integer currTable) {
		this.currTable = currTable;
	}
	public Integer getCurrClass() {
		return currClass;
	}
	public void setClassNumber(Integer currClass) {
		this.currClass = currClass;
	}
	public Double getClassHours() {
		return classHours;
	}
	public void setClassHours(Double classHours) {
		this.classHours = classHours;
	}
}