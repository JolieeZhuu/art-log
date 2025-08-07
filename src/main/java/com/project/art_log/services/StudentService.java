package com.project.art_log.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.art_log.entities.Student;
import com.project.art_log.repos.StudentRepo;

@Service
public class StudentService extends AbstractService<Student, Integer> {
	
	private final StudentRepo studentRepo;
	
	public StudentService(StudentRepo studentRepo) {
		super(studentRepo);
		this.studentRepo = studentRepo;
	}
	
	// Student specific service functions
	
	public List<Student> getByDay(String day) {
        return studentRepo.findByDayIgnoreCase(day);
    }
	
	public List<Student> getByDayAndTimeOrderedByTimeAndName(String day, String substring) {
		return studentRepo.findByDayAndTimeOrderedByTimeAndName(day, substring);
	}
}