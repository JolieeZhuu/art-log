package com.project.art_log.controllers;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    
    @GetMapping("/day/{day}")
    public ResponseEntity<List<Student>> getByDay(@PathVariable("day") String day) {
    	System.out.println("getting by day works"); 
    	return ResponseEntity.ok().body(studentService.getByDay(day)); 
    }
    
    @GetMapping("/day-string/{day}/{substring}")
    public ResponseEntity<List<Student>> getByDayAndTimeOrderedByTimeAndName(@PathVariable("day") String day, 
    																      @PathVariable("substring") String substring) {
    	System.out.println("getting by day and expected time substring works");
    	return ResponseEntity.ok().body(studentService.getByDayAndTimeOrderedByTimeAndName(day, substring));
    }
}

/*
{
	"first_name": "Jolie",
	"last_name": "Zhu",
	"class_id": "LV1",
	"day": "Monday",
	"phone_number": "1234567890"
}

*/