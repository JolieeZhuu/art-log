package com.project.art_log;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<Student>> getByDayAndTimeExpectedContaining(@PathVariable("day") String day, 
    																      @PathVariable("substring") String substring) {
    	Sort sort = Sort.by("timeExpected").ascending();
    	System.out.println("getting by day and expected time substring works");
    	return ResponseEntity.ok().body(studentService.getByDayAndTimeExpectedContaining(day, substring, sort));
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