package com.project.art_log.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.project.art_log.services.AbstractService;

public abstract class AbstractController<T, ID> {
	private final AbstractService<T, ID> service;
	
	public AbstractController(AbstractService<T, ID> service) {
		this.service = service;
	}
	
    @GetMapping("/")
    public ResponseEntity<List<T>> getAll() {
    	System.out.println("getting all works"); 
        return ResponseEntity.ok().body(service.getAll());  
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> getById(@PathVariable("id") ID id) {
    	System.out.println("getting by id works");
        return ResponseEntity.ok().body(service.getById(id));
    }

    @PostMapping("/")
    public ResponseEntity<T> save(@RequestBody T entity) {
    	System.out.println("posting works");
        return ResponseEntity.ok().body(service.save(entity));
    }

    @PutMapping("/")
    public ResponseEntity<T> update(@RequestBody T entity) {
    	System.out.println("putting works");
        return ResponseEntity.ok().body(service.update(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable("id") ID id) {
    	System.out.println("deleting works");
    	service.deleteById(id);
        return ResponseEntity.ok().body("Deleted student successfully");
    }
}
