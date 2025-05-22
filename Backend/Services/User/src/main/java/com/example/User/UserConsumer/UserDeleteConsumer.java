package com.example.User.UserConsumer;

import com.example.User.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class UserDeleteConsumer {
    private final UserRepository userRepository;

    public UserDeleteConsumer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Bean
    public Consumer<Integer> userDeleteeConsumer() {
        System.out.println("UserDeleteConsumer");
        return event -> this.userRepository.deleteById(event);
    }
}
