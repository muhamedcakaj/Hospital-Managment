package com.example.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity,Integer> {
    List<AppointmentEntity> findAppointmentsByDoctorIdOrderByLocalDateDescLocalTimeDesc(Integer doctorId);
    boolean existsByDoctorIdAndLocalDateAndLocalTime(int doctorId, LocalDate localDate, LocalTime localTime);
    List<AppointmentEntity> findAppointmentsByUserIdOrderByLocalDateDescLocalTimeDesc(int userId);
}
