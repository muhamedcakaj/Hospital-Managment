package com.example.Auth.DTO;

public class AdminEditDoctorEvent {
    private int id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String description;
    private String email;
    private int emailConfirmation;

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public int getId() {
        return id;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getDescription() {
        return description;
    }

    public String getEmail() {
        return email;
    }

    public int getEmailConfirmation() {
        return emailConfirmation;
    }
}
