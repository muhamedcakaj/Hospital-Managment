package com.example.Auth.EventConsumer;

import com.example.Auth.AuthEntity;
import com.example.Auth.AuthRepository;
import com.example.Auth.DTO.AdminEditeUserEvent;
import com.example.Auth.DTO.UserCreatedEvent;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class UserCreateConsumerFromAdmin {

    private final StreamBridge streamBridge;
    private final AuthRepository authRepository;

    public UserCreateConsumerFromAdmin(StreamBridge streamBridge, AuthRepository authRepository) {
        this.streamBridge = streamBridge;
        this.authRepository = authRepository;
    }

    @Bean
    public Consumer<AdminEditeUserEvent> userUpdateAdminConsumer() {
        return event -> {

            AuthEntity authEntity1 = authRepository.findById(event.getId()).orElse(null);
            authEntity1.setEmail(event.getEmail());
            authEntity1.setEmailConfirmation(event.getEmailConfirmation());
            authRepository.save(authEntity1);

            UserCreatedEvent user = new UserCreatedEvent();
            user.setUserId(event.getId());
            user.setFirstName(event.getFirstName());
            user.setLastName(event.getLastName());

            streamBridge.send("userCreated-out-0", user);
        };
    }
}
