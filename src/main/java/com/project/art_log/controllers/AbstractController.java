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

// Handles incoming HTTP requests from the front-end
// Prepares the data to be return to the user

public abstract class AbstractController<T, ID> {
	private final AbstractService<T, ID> service;
	
	public AbstractController(AbstractService<T, ID> service) {
		this.service = service;
	}
	
    @GetMapping("/") // example of an endpoint, to fetch all entities specified by the program
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
    	try {
        	System.out.println("posting works");
            System.out.println("=== POST REQUEST RECEIVED ===");
            System.out.println("Request body: " + entity);
            System.out.println("==========================");
            return ResponseEntity.ok().body(service.save(entity));
    	} catch (Exception e) {
            System.out.println("=== Error creating student: " + e.getMessage() + " ===");
            return ResponseEntity.status(500).build();
    	}
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
    
    // debug
    @PostMapping("/debug")
    public ResponseEntity<String> debugRaw(@RequestBody String raw) {
        System.out.println("=== RAW BODY RECEIVED ===");
        System.out.println(raw);
        System.out.println("=========================");
        return ResponseEntity.ok("Got raw: " + raw);
    }
}

/*
{
    "first_name": "Emma",
    "last_name": "Stone",
    "class_hours": 1,
    "class_id": "PRE-U",
    "class_number": 0,
    "day": "Monday",
    "general_notes": "",
    "payment_number": 0,
    "phone_number": "1234567890",
    "time_expected": "15:00:00",
    "total_classes": 0
}

{
	"email": "zhujolie973@gmail.com",
	"password": "postgres"
}
*/
