package com.project.art_log.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.art_log.entities.Student;
import com.project.art_log.services.StudentService;

@RestController
@RequestMapping("/student")
@Validated
public class StudentController extends AbstractController<Student, Integer> {
	
	public final StudentService studentService;
	
	public StudentController(StudentService studentService) {
		super(studentService);
		this.studentService = studentService;
	}
	
	// Student specific controller functions
    
    @GetMapping("/day/{day}")
    public ResponseEntity<List<Student>> getByDay(@PathVariable("day") String day) {
    	System.out.println("getting by day works"); 
    	return ResponseEntity.ok().body(studentService.getByDay(day)); 
    }
    
    @GetMapping("/day-string/{day}")
    public ResponseEntity<List<Student>> getByDayAndTimeOrderedByTimeAndName(@PathVariable("day") String day) {
    	System.out.println("getting by day and ordered by expected time works");
    	return ResponseEntity.ok().body(studentService.getByDayAndTimeOrderedByTimeAndName(day));
    }
}