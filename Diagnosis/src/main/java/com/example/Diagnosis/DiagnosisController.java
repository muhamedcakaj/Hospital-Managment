package com.example.Diagnosis;

import com.example.Diagnosis.DTO.DiagnosisCreateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/diagnosis")
public class DiagnosisController {

    private DiagnosisService diagnosisService;


    @Autowired
    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    @PostMapping
    public ResponseEntity<String> createDiagnosis(@RequestBody DiagnosisCreateDTO dto) {
        this.diagnosisService.createDiagnosis(dto);
        return ResponseEntity.ok("Diagnosis creation initiated");
    }
}
