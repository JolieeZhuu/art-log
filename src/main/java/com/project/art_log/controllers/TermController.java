package com.project.art_log.controllers;

import org.springframework.validation.annotation.Validated;
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
}
