package com.example.Auth.EmailService;

public interface EmailService {

    void sendConfirmationEmail(String to, String confirmationCode);
}
