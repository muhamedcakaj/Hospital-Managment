package com.example.User.UserConsumer;

import com.example.User.DTO.UserCreatedEvent;
import com.example.User.UserEntity;
import com.example.User.UserRepository;
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
            UserEntity user = new UserEntity();
            user.setId(event.getId());
            user.setFirst_name(event.getFirstName());
            user.setSecond_name(event.getLastName());

            userRepository.save(user);
        };
    }
}

