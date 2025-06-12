package com.example.Auth;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="auth_table")
public class AuthEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique=true, nullable=false, length=75)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(nullable=false, length=8)
    private String role= "User";

    private int emailConfirmation = 0;

    private String confirmationCode;

    private LocalDateTime confirmationCodeExpiry;

    private String fcmtoken;

    public int getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getConfirmationCodeExpiry() {
        return confirmationCodeExpiry;
    }

    public void setConfirmationCodeExpiry(LocalDateTime confirmationCodeExpiry) {
        this.confirmationCodeExpiry = confirmationCodeExpiry;
    }

    public String getConfirmationCode() {
        return confirmationCode;
    }

    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }

    public int getEmailConfirmation() {
        return emailConfirmation;
    }

    public void setEmailConfirmation(int emailConfirmation) {
        this.emailConfirmation = emailConfirmation;
    }

    public String getFcmtoken() {
        return fcmtoken;
    }

    public void setFcmtoken(String fcmtoken) {
        this.fcmtoken = fcmtoken;
    }
}
