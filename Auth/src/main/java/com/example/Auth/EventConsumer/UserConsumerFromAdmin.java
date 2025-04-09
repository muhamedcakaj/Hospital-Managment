package com.example.Auth.EventConsumer;

import com.example.Auth.AuthEntity;
import com.example.Auth.AuthRepository;
import com.example.Auth.DTO.AdminCreatedUserEvent;
import com.example.Auth.DTO.UserCreatedEvent;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.function.Consumer;

@Configuration
public class UserConsumerFromAdmin {

        private final AuthRepository authRepository;
        private final StreamBridge streamBridge;
        private final PasswordEncoder passwordEncoder;

        public UserConsumerFromAdmin(AuthRepository authRepository, StreamBridge streamBridge, PasswordEncoder passwordEncoder) {
            this.authRepository = authRepository;
            this.streamBridge = streamBridge;
            this.passwordEncoder = passwordEncoder;
        }

        @Bean
        public Consumer<AdminCreatedUserEvent> userCreatedAdminConsumer() {
            return event -> {
                AuthEntity authEntity = new AuthEntity();

                String encryptedPassword = passwordEncoder.encode(event.getPassword());

                authEntity.setEmail(event.getEmail());
                authEntity.setPassword(encryptedPassword);
                authRepository.save(authEntity);

                AuthEntity authEntity1 = authRepository.findByEmail(event.getEmail());

                UserCreatedEvent userCreatedEvent = new UserCreatedEvent();

                userCreatedEvent.setId(authEntity1.getId());
                userCreatedEvent.setFirstName(event.getFirstName());
                userCreatedEvent.setLastName(event.getLastName());

                streamBridge.send("userCreated-out-0", userCreatedEvent);
            };
        }
    }
