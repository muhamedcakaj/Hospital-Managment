package com.example.Diagnosis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DiagnosisApplication {

	public static void main(String[] args) {
		SpringApplication.run(DiagnosisApplication.class, args);
	}

}
