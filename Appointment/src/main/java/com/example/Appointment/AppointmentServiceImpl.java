package com.example.Appointment;

import com.example.Appointment.DTO.AppointmentCreateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public void createAppointment(AppointmentCreateDTO dto) {
        LocalDate today = LocalDate.now();
        LocalTime startTime = LocalTime.of(8, 0);
        LocalTime endTime = LocalTime.of(16, 0);

        if (dto.getDate().isBefore(today)) {
            throw new IllegalArgumentException("Cannot create appointment in the past.");
        }

        if (dto.getTime().isBefore(startTime) || dto.getTime().isAfter(endTime)) {
            throw new IllegalArgumentException("Appointment must be between 08:00 and 16:00.");
        }

        if (dto.getTime().getMinute() != 0 && dto.getTime().getMinute() != 30) {
            throw new IllegalArgumentException("Appointments must be scheduled at every 30 minutes.");
        }

        AppointmentEntity appointment = new AppointmentEntity();
        appointment.setDoctorId(dto.getDoctorId());
        appointment.setUserId(dto.getUserId());
        appointment.setDate(dto.getDate());
        appointment.setTime(dto.getTime());
        appointment.setStatus("PENDING");

        appointmentRepository.save(appointment);
    }
}
