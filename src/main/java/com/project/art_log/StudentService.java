package com.project.art_log;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class StudentService extends AbstractService<Student, Integer> {
	
	private final StudentRepo studentRepo;
	
	public StudentService(StudentRepo studentRepo) {
		super(studentRepo);
		this.studentRepo = studentRepo;
	}
	
	public List<Student> getByDay(String day) {
        return studentRepo.findByDayIgnoreCase(day);
    }
	
	public List<Student> getByDayAndTimeExpectedContaining(String day, String substring, Sort sort) {
		return studentRepo.findByDayIgnoreCaseAndTimeExpectedContaining(day, substring, sort);
	}
}