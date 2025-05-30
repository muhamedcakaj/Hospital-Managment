package com.example.Doctor.Consumer;

import com.example.Doctor.DTO.DoctorCreatedDTO;
import com.example.Doctor.DoctorEntity;
import com.example.Doctor.DoctorRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class DoctorConsumer {

    private final DoctorRepository doctorRepository;

    public DoctorConsumer(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Bean
    public Consumer<DoctorCreatedDTO> doctorCreatedConsumer() {
        return event -> {
            DoctorEntity doctor = new DoctorEntity();
            doctor.setId(event.getId());
            doctor.setFirst_name(event.getFirstName());
            doctor.setLast_name(event.getLastName());
            doctor.setSpecialization(event.getSpecialization());
            doctor.setDescription(event.getDescription());

            doctorRepository.save(doctor);
        };
    }
}
