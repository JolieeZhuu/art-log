package com.project.art_log.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.art_log.entities.Term;
import com.project.art_log.services.TermService;

@RestController
@RequestMapping("/term")
@Validated
public class TermController extends AbstractController<Term, Integer> {
	
	public final TermService termService;
	
	public TermController(TermService termService) {
		super(termService);
		this.termService = termService;
	}
	
	// Term specific controller functions (from TermService)
	@GetMapping("/{studentId}/{tableNum}")
	public ResponseEntity<Term> getTermTable(@PathVariable("studentId") Integer studentId, @PathVariable("tableNum") Integer tableNum) {
		System.out.println("getting by student id and table num works");
		return ResponseEntity.ok().body(termService.getByStudentIdAndTableNum(studentId, tableNum));
	}
}
