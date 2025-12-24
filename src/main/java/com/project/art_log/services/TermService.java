package com.project.art_log.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.art_log.entities.Term;
import com.project.art_log.repos.TermRepo;

@Service
public class TermService extends AbstractService<Term, Integer> {
	
	private final TermRepo termRepo;
	
	public TermService(TermRepo termRepo) {
		super(termRepo);
		this.termRepo = termRepo;
	}
	
	// Term specific service functions (from TermRepo)
	public Term getByStudentIdAndTableNum(Integer studentId, Integer tableNum) {
		return termRepo.findByStudentIdAndTableNum(studentId, tableNum);
	}
	
	@Transactional
	public int deleteByStudentId(Integer studentId) {
		return termRepo.deleteByStudentId(studentId);
	}
}
