package com.example.Admin.Dto;

import java.time.LocalDateTime;

public class AuthEntityDTO {

    private int id;

    private String email;

    private String password;

    private String role;

    private int emailConfirmation = 0;

    private String confirmationCode;

    private LocalDateTime confirmationCodeExpiry;

    private String fcmToken;

    public int getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public int getEmailConfirmation() {
        return emailConfirmation;
    }

    public String getConfirmationCode() {
        return confirmationCode;
    }

    public LocalDateTime getConfirmationCodeExpiry() {
        return confirmationCodeExpiry;
    }

    public String getFcmToken() {
        return fcmToken;
    }
}
