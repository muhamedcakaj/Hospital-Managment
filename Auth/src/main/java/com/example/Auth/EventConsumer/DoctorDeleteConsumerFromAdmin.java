package com.example.Auth.EventConsumer;

import com.example.Auth.AuthRepository;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class DoctorDeleteConsumerFromAdmin {
    private final StreamBridge streamBridge;
    private final AuthRepository authRepository;

    public DoctorDeleteConsumerFromAdmin(StreamBridge streamBridge, AuthRepository authRepository) {
        this.streamBridge = streamBridge;
        this.authRepository = authRepository;
    }

    @Bean
    public Consumer<Integer> doctorDeleteAdminConsumer() {
        return event -> {
            System.out.println("Doctor Delete Admin");
            this.authRepository.deleteById(event);

            this.streamBridge.send("doctorDeletee-out-0", event);
        };
    }

}
