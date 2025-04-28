package com.example.Appointment;

import com.example.Appointment.DTO.AppointmentCreateDTO;

import java.util.List;

public interface AppointmentService {

    void createAppointment(AppointmentCreateDTO dto);
    List<AppointmentEntity> findAppointmentByDoctorId(int doctorId);
}
