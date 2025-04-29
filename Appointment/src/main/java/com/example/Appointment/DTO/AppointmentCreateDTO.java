package com.example.Appointment.DTO;

import jakarta.persistence.TemporalType;
import org.springframework.data.jpa.repository.Temporal;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentCreateDTO {
    private int doctorId;
    private int userId;
    private LocalDate localDate;
    private LocalTime localTime;

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDate getLocalDate() {
        return localDate;
    }

    public void setLocalDate(LocalDate date) {
        this.localDate = date;
    }

    public LocalTime getLocalTime() {
        return localTime;
    }

    public void setLocalTime(LocalTime time) {
        this.localTime = time;
    }
}
