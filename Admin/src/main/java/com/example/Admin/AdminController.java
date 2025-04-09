package com.example.Admin;

import com.example.Admin.Dto.CreateDoctorDTO;
import com.example.Admin.Dto.CreateUserDTO;
import com.example.Admin.Dto.UpdateDoctorDTO;
import com.example.Admin.Dto.UpdateUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
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
        this.adminService.deleteUser(id);
        return ResponseEntity.ok("Delete event sent as ID: " + id);
    }
}
