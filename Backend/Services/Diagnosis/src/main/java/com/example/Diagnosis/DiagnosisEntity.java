package com.example.Diagnosis;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="diagnosis")
public class DiagnosisEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int doctorId;

    @Column(nullable = false,length = 15)
    private String doctorName;

    @Column(nullable = false,length =15)
    private String doctorSurname;

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false,length = 20)
    private String userName;

    @Column(nullable = false,length = 20)
    private String userSurname;

    @Column(nullable = false)
    private String diagnosis;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime diagnosis_date;

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

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public LocalDateTime getDiagnosis_date() {
        return diagnosis_date;
    }

    public void setDiagnosis_date(LocalDateTime diagnosis_date) {
        this.diagnosis_date = diagnosis_date;
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
