package com.example.Doctor.Consumer;

import com.example.Doctor.DTO.DoctorUpdateDTO;
import com.example.Doctor.DoctorEntity;
import com.example.Doctor.DoctorRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;
import java.util.function.Consumer;
@Configuration
public class DoctorUpdateConsumer {
    private final DoctorRepository doctorRepository;

    public DoctorUpdateConsumer(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Bean
    public Consumer<DoctorUpdateDTO> doctorUpdateeConsumer() {
        return event ->{
            Optional<DoctorEntity> doctor = doctorRepository.findById(event.getId());
            if (doctor.isPresent()) {
                DoctorEntity doctorEntity = doctor.get();
                doctorEntity.setFirst_name(event.getFirstName());
                doctorEntity.setLast_name(event.getLastName());
                doctorEntity.setSpecialization(event.getSpecialization());
                doctorEntity.setDescription(event.getDescription());
                this.doctorRepository.save(doctorEntity);
            }
        };
    }
}
