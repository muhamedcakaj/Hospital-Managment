package com.example.User.UserConsumer;


import com.example.User.DTO.UserCreatedEvent;
import com.example.User.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class UserUpdateEvent {
    private final UserRepository userRepository;

    public UserUpdateEvent(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public Consumer<UserCreatedEvent> userUpdateConsumer() {
        return event -> this.userRepository.findById(event.getUserId()).ifPresent(user -> {
            user.setFirst_name(event.getFirstName());
            user.setSecond_name(event.getLastName());
        });
    }
}
