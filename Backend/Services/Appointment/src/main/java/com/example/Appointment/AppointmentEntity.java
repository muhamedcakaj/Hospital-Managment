package com.example.Appointment;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="appointment")
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable=false)
    private int doctorId;

    @Column(nullable = false,length = 15)
    private String doctorName;

    @Column(nullable = false,length = 15)
    private String doctorSurname;

    @Column(nullable=false)
    private int userId;

    @Column(nullable = false,length = 75)
    private String userEmail;

    @Column(nullable = false,length = 20)
    private String userName;

    @Column(nullable = false,length = 20)
    private String userSurname;

    @Column(nullable=false)
    private LocalDate localDate;

    @Column(nullable=false)
    private LocalTime localTime;

    @Column(nullable=false, length=12)
    private String appointemntStatus = "Pending";

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public LocalDate getLocalDate() {
        return localDate;
    }

    public void setLocalDate(LocalDate localDate) {
        this.localDate = localDate;
    }

    public LocalTime getLocalTime() {
        return localTime;
    }

    public void setLocalTime(LocalTime localTime) {
        this.localTime = localTime;
    }

    public String getAppointemntStatus() {
        return appointemntStatus;
    }

    public void setAppointemntStatus(String appointemntStatus) {
        this.appointemntStatus = appointemntStatus;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSurname() {
        return doctorSurname;
    }

    public void setDoctorSurname(String doctorSurname) {
        this.doctorSurname = doctorSurname;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserSurname() {
        return userSurname;
    }

    public void setUserSurname(String userSurname) {
        this.userSurname = userSurname;
    }
}
