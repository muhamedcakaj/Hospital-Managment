package com.example.Doctor.DTO;

public class DoctorUpdateDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String description;

    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getDescription() {
        return description;
    }
}
