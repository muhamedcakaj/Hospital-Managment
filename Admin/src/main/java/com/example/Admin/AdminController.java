package com.example.Admin;

import com.example.Admin.Dto.CreateDoctorDTO;
import com.example.Admin.Dto.CreateUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
