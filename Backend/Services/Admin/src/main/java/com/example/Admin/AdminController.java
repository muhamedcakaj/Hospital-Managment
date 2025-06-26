package com.example.Admin;

import com.example.Admin.Dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users/read")
    public ResponseEntity<List<ReadUserDTO>> readAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/doctors/read")
    public ResponseEntity<List<ReadDoctorDTO>> readAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @PostMapping("/users")
    public ResponseEntity<String> createUser(@RequestBody CreateUserDTO dto) {
        adminService.createUser(dto);
        return ResponseEntity.ok("User creation initiated");
    }

    @PostMapping("/doctors")
    public ResponseEntity<String> createDoctor(@RequestBody CreateDoctorDTO dto) {
        adminService.createDoctor(dto);
        return ResponseEntity.ok("Doctor creation initiated");
    }
    @PostMapping("/users/update")
    public ResponseEntity<String> updateUser(@RequestBody UpdateUserDTO dto) {
        adminService.updateUser(dto);
        return ResponseEntity.ok("User update initiated");
    }

    @PostMapping("/doctors/update")
    public ResponseEntity<String> updateDoctor(@RequestBody UpdateDoctorDTO dto) {
        adminService.updateDoctor(dto);
        return ResponseEntity.ok("Doctor update initiated");
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        this.adminService.deleteUser(id);
        return ResponseEntity.ok("Delete event sent as ID: " + id);
    }
    @DeleteMapping("/doctor/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable int id) {
        this.adminService.deleteDoctor(id);
        return ResponseEntity.ok("Delete event sent as ID: " + id);
    }
}
