package com.example.Doctor.Consumer;

import com.example.Doctor.DoctorRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class DoctorDeleteConsumer {

    private final DoctorRepository doctorRepository;

    public DoctorDeleteConsumer(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Bean
    public Consumer<Integer> doctorDeleteeConsumer() {
        return event -> this.doctorRepository.deleteById(event);
    }
}
