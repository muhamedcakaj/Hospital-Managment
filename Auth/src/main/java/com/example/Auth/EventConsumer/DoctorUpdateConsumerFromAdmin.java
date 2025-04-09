package com.example.Auth.EventConsumer;

import com.example.Auth.AuthEntity;
import com.example.Auth.AuthRepository;
import com.example.Auth.DTO.AdminEditDoctorEvent;
import com.example.Auth.DTO.DoctorCreatedEvent;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class DoctorUpdateConsumerFromAdmin {
    private final StreamBridge streamBridge;
    private final AuthRepository authRepository;

    public DoctorUpdateConsumerFromAdmin(StreamBridge streamBridge, AuthRepository authRepository) {
        this.streamBridge = streamBridge;
        this.authRepository = authRepository;
    }
    @Bean
    public Consumer<AdminEditDoctorEvent> doctorUpdateAdminConsumer() {
        return event -> {

            AuthEntity authEntity1 = authRepository.findById(event.getId()).orElse(null);

            authEntity1.setEmail(event.getEmail());
            authEntity1.setEmailConfirmation(event.getEmailConfirmation());
            authRepository.save(authEntity1);

            DoctorCreatedEvent doctor = new DoctorCreatedEvent();

            doctor.setId(event.getId());
            doctor.setFirstName(event.getFirstName());
            doctor.setLastName(event.getLastName());
            doctor.setSpecialization(event.getSpecialization());
            doctor.setDescription(event.getDescription());

            streamBridge.send("doctorUpdatee-out-0", doctor);
        };
    }
}
