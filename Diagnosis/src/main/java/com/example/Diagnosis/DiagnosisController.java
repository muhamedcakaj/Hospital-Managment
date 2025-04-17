package com.example.Diagnosis;

import com.example.Diagnosis.DTO.DiagnosisCreateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diagnosis")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;


    @Autowired
    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    @GetMapping("/user/{id}")
    ResponseEntity<List<DiagnosisEntity>> findByUserId(@PathVariable int id){
        return ResponseEntity.ok(this.diagnosisService.findByUserId(id));
    }

    @GetMapping("/doctor/{id}")
    ResponseEntity<List<DiagnosisEntity>> findByDoctorId(@PathVariable int id){
        return ResponseEntity.ok(this.diagnosisService.findByDoctorId(id));
    }

    @PostMapping
    public ResponseEntity<String> createDiagnosis(@RequestBody DiagnosisCreateDTO dto) {
        this.diagnosisService.createDiagnosis(dto);
        return ResponseEntity.ok("Diagnosis creation initiated");
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiagnosisEntity>updateDiagnose(
            @PathVariable int id,
            @RequestBody DiagnosisEntity diagnosisEntity) {

        return ResponseEntity.ok(this.diagnosisService.updateDiagnosis(id, diagnosisEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDiagnosis(@PathVariable int id) {
        this.diagnosisService.deleteDiagnosisById(id);
        return ResponseEntity.ok("ok");
    }
}
