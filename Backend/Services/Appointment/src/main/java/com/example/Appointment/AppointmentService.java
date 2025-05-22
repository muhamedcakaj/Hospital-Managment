package com.example.Appointment;

import com.example.Appointment.DTO.AppointmentCreateDTO;

import java.util.List;

public interface AppointmentService {

    void createAppointment(AppointmentCreateDTO dto);
    List<AppointmentEntity> findAppointmentByDoctorId(int doctorId);
    List<AppointmentEntity>findAppointmentsByUserId(int userId);
    public void updateStatus(int id, String newStatus);
}
