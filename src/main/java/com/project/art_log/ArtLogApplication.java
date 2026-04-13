package com.project.art_log;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
public class ArtLogApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtLogApplication.class, args);
	}

}
