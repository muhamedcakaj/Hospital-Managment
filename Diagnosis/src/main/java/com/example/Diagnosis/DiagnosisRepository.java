package com.example.Diagnosis;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosisRepository extends JpaRepository<DiagnosisEntity,Integer> {
    List<DiagnosisEntity> findByUserId(int userId);
    List<DiagnosisEntity>findByDoctorId(int doctorId);
}
