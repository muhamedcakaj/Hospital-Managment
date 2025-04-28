package com.example.Appointment;

import com.example.Appointment.DTO.AppointmentCreateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot create appointment in the past.");
        }

        LocalTime time = dto.getTime();
        if (time.isBefore(startTime) || time.isAfter(endTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment must be between 08:00 and 16:00.");
        }

        //boolean alreadyBooked = appointmentRepository.existsByDoctorAndDateTime(dto.getDoctorId(), dto.getDate(), dto.getTime());
       // if (alreadyBooked) {
          //  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This time slot is already booked.");
       // }
        AppointmentEntity appointment = new AppointmentEntity();
        appointment.setDoctorId(dto.getDoctorId());
        appointment.setUserId(dto.getUserId());
        appointment.setDate(dto.getDate());
        appointment.setTime(dto.getTime());

        appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentEntity> findAppointmentByDoctorId(int doctorId) {
        return this.appointmentRepository.findAppointmentsByDoctorId(doctorId);
    }
}
