package com.example.User;

import com.example.User.DTO.UserCreatedEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class UserConsumer {
    private final UserRepository userRepository;

    public UserConsumer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public Consumer<UserCreatedEvent> userCreatedConsumer() {
        return event -> {
            System.out.println("Received event: " + event.getUserId());

            UserEntity user = new UserEntity();
            user.setId(event.getUserId());
            user.setFirst_name(event.getFirstName());
            user.setSecond_name(event.getLastName());

            userRepository.save(user);
        };
    }
}

