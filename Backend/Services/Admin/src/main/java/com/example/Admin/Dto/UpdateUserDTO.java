package com.example.Admin.Dto;

public class UpdateUserDTO {
    private int id;
    private String firstName;
    private String lastName;
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
