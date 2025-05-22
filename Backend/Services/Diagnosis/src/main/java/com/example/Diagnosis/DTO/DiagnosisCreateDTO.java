package com.example.Diagnosis.DTO;

public class DiagnosisCreateDTO {
    private int doctorId;
    private String userEmail;
    private String diagnosis;

    public int getDoctorId() {
        return doctorId;
    }
    public String getUserEmail() {
        return userEmail;
    }

    public String getDiagnosis() {
        return diagnosis;
    }
}
