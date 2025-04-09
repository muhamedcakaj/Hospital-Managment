package com.example.User.UserConsumer;



import com.example.User.DTO.UserUpdatedEvent;
import com.example.User.UserEntity;
import com.example.User.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;
import java.util.function.Consumer;

@Configuration
public class UserUpdateEvent {
    private final UserRepository userRepository;

    public UserUpdateEvent(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public Consumer<UserUpdatedEvent> userUpdateConsumer() {
        return event ->{
            Optional<UserEntity> user = userRepository.findById(event.getId());
            System.out.println(user.isPresent());
            if (user.isPresent()) {
                UserEntity userEntity = user.get();
                userEntity.setFirst_name(event.getFirstName());
                userEntity.setSecond_name(event.getLastName());
                this.userRepository.save(userEntity);
            }
        };
        }
    }
