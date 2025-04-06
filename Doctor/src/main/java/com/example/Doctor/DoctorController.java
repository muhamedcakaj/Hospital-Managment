package com.example.Doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/doctors")
@PreAuthorize("hasRole('Doctor')")
public class DoctorController {
    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorEntity> getDoctorById(@PathVariable int id){

        DoctorEntity doctorEntity = this.doctorService.findById(id);
        return ResponseEntity.ok(doctorEntity);
    }

    @PostMapping
    public ResponseEntity<DoctorEntity> createUser(@RequestBody DoctorEntity userEntity) {
        DoctorEntity savedUser = doctorService.save(userEntity);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorEntity> updateUser(
            @PathVariable int id,
            @RequestBody DoctorEntity doctorEntity) {

        DoctorEntity updatedUser = doctorService.update(id, doctorEntity);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        doctorService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
