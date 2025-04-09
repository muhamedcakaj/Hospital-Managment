package com.example.Auth.EventConsumer;

import com.example.Auth.AuthRepository;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class UserDeleteConsumerFromAdmin {
    private final StreamBridge streamBridge;
    private final AuthRepository authRepository;

    public UserDeleteConsumerFromAdmin(StreamBridge streamBridge, AuthRepository authRepository) {
        this.streamBridge = streamBridge;
        this.authRepository = authRepository;
    }

    @Bean
    public Consumer<Integer> userDeleteAdminConsumer() {
        return event -> {
            System.out.println("userDeleteAdminConsumer-out-0");
            this.authRepository.deleteById(event);

            this.streamBridge.send("userDeletee-out-0", event);
        };
    }
}
