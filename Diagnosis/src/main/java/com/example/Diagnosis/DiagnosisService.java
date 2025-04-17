package com.example.Diagnosis;

import com.example.Diagnosis.DTO.DiagnosisCreateDTO;

import java.util.List;

public interface DiagnosisService {
    void createDiagnosis(DiagnosisCreateDTO diagnosisCreateDTO);
    List<DiagnosisEntity> findByUserId(int userId);
    List<DiagnosisEntity>findByDoctorId(int doctorId);
    void deleteDiagnosisById(int diagnosisId);
    DiagnosisEntity updateDiagnosis(int id, DiagnosisEntity diagnosisEntity);
}
