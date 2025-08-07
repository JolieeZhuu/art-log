package com.project.art_log.controllers;

import com.tetradotoxina.gtts4j.*;
import com.tetradotoxina.gtts4j.impl.GTTS4JImpl;

import java.io.File;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TtsController {

    // Example URL: http://localhost:8080/speak?text=Hello+world&lang=en
	// Path ends in /speak, and will return an mp3 file (hence audio/mpeg)
	
    @GetMapping(value = "/speak", produces = "audio/mpeg") // Endpoint to generate speech from text.
    public ResponseEntity<byte[]> speak(@RequestParam("text") String text,
            							@RequestParam(value = "lang", defaultValue = "en") String lang) {
    	
    	System.out.println("audio bytes sent");

        // Basic security check to prevent very long requests
        if (text.length() > 500) {
            return ResponseEntity.badRequest().build();
        }

        try {
        	// From documentation
        	GTTS4J gtts4j = new GTTS4JImpl();
        	boolean slow = false; // Set speech speed to normal
        	// String filePath = System.getProperty("user.dir")+File.separator+"speech.mp3";

        	byte[] data = gtts4j.textToSpeech(text, lang, slow); // Converts the string to audio bytes
        	// gtts4j.saveFile(filePath, data, true); // converts bytes to audio file

        	
        	HttpHeaders headers = new HttpHeaders();
        	headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=speech.mp3");
        	
        	// returns audio bytes with 200 OK status
        	return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("audio/mpeg")).body(data);

        } catch (Exception e) {
            // If anything goes wrong, log the error and return a server error status
            System.err.println("Error generating TTS audio: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}