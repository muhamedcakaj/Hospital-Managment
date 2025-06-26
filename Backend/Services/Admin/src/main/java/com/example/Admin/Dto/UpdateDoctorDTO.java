package com.example.Admin.Dto;

public class UpdateDoctorDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String description;
    private String email;
    private int emailConfirmation=1;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getEmailConfirmation() {
        return emailConfirmation;
    }

    public void setEmailConfirmation(int emailConfirmation) {
        this.emailConfirmation = emailConfirmation;
    }
}
