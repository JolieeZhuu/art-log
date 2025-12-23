package com.project.art_log.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "term")
public class Term {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer termId;
	
	private Integer studentId;
	private Integer totalClasses;
	private String paymentNotes;
	private String termNotes;
	private Integer tableNum;
	private String attendanceIds;
	
	public Term() {
		
	}	
	public Term(Integer termId, Integer studentId, Integer totalClasses, String paymentNotes, String termNotes, 
			Integer tableNum, String attendanceIds) {
		super();
		this.termId = termId;
		this.studentId = studentId;
		this.totalClasses = totalClasses;
		this.paymentNotes = paymentNotes;
		this.termNotes = termNotes;
		this.tableNum = tableNum;
		this.attendanceIds = attendanceIds;
	}
	public Integer getTermId() {
		return termId;
	}
	public void setTermId(Integer termId) {
		this.termId = termId;
	}
	public Integer getStudentId() {
		return studentId;
	}
	public void setStudentId(Integer studentId) {
		this.studentId = studentId;
	}
	public Integer getTotalClasses() {
		return totalClasses;
	}
	public void setTotalClasses(Integer totalClasses) {
		this.totalClasses = totalClasses;
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
	public Integer getTableNum() {
		return tableNum;
	}
	public void setTableNum(Integer tableNum) {
		this.tableNum = tableNum;
	}
	public String getAttendanceIds() {
		return attendanceIds;
	}
	public void setAttendanceIds(String attendanceIds) {
		this.attendanceIds = attendanceIds;
	}
}
