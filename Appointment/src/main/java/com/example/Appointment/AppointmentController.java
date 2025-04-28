package com.example.Appointment;

import com.example.Appointment.DTO.AppointmentCreateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("doctor/{id}")
    public ResponseEntity<List<AppointmentEntity>> findDoctorAppointmentById(@PathVariable int id){
        List<AppointmentEntity> appointments = appointmentService.findAppointmentByDoctorId(id);
        return ResponseEntity.ok(appointments);
    }


    @PostMapping
    public ResponseEntity<String> createAppointment(@RequestBody AppointmentCreateDTO dto) {
        appointmentService.createAppointment(dto);
        return ResponseEntity.ok("Appointment created successfully!");
    }
}
