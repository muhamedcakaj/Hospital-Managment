package com.example.Auth.EventConsumer;

import com.example.Auth.AuthEntity;
import com.example.Auth.AuthRepository;
import com.example.Auth.DTO.AdminCreatedDoctorEvent;
import com.example.Auth.DTO.DoctorCreatedEvent;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.function.Consumer;

@Configuration
public class DoctorConsumerFromAdmin {
    private final AuthRepository authRepository;
    private final StreamBridge streamBridge;
    private final PasswordEncoder passwordEncoder;

    public DoctorConsumerFromAdmin(AuthRepository authRepository, StreamBridge streamBridge, PasswordEncoder passwordEncoder) {
        this.authRepository = authRepository;
        this.streamBridge = streamBridge;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public Consumer<AdminCreatedDoctorEvent> doctorCreatedAdminConsumer() {
        return event -> {
            AuthEntity authEntity = new AuthEntity();
            String encryptedPassword = passwordEncoder.encode(event.getPassword());

            authEntity.setEmail(event.getEmail());
            authEntity.setPassword(encryptedPassword);
            authEntity.setRole("Doctor");
            authRepository.save(authEntity);

            AuthEntity authEntity1 = authRepository.findByEmail(event.getEmail());

            DoctorCreatedEvent doctorCreatedEvent = new DoctorCreatedEvent();

            doctorCreatedEvent.setId(authEntity1.getId());
            doctorCreatedEvent.setFirstName(event.getFirstName());
            doctorCreatedEvent.setLastName(event.getLastName());
            doctorCreatedEvent.setDescription(event.getDescription());
            doctorCreatedEvent.setSpecialization(event.getSpecialization());

            streamBridge.send("doctorCreated-out-0", doctorCreatedEvent);
        };
    }
}
