package com.example.Diagnosis;

import com.example.Diagnosis.DTO.DiagnosisCreateDTO;
import com.example.Diagnosis.ExceptionHandlers.InvalidUserInputException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DiagnosisServiceImpl implements DiagnosisService{

    private final DiagnosisRepository diagnosisRepository;
    RestTemplate restTemplate;

    @Value("${auth-service.verify-email-url}")
    private String verifyEmailUrl;

    @Autowired
    public DiagnosisServiceImpl(DiagnosisRepository diagnosisRepository,RestTemplate restTemplate) {
        this.diagnosisRepository = diagnosisRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public void createDiagnosis(DiagnosisCreateDTO diagnosisCreateDTO) {
        String url = verifyEmailUrl + "?email=" + diagnosisCreateDTO.getUserEmail();

        try {
            int userId = restTemplate.getForObject(url, Integer.class);
            if (userId <= 0) {
                throw new InvalidUserInputException("Invalid or unregistered user email.");
            }
            DiagnosisEntity diagnosis = new DiagnosisEntity();

            diagnosis.setDoctorId(diagnosisCreateDTO.getDoctorId());
            diagnosis.setUserId(userId);
            diagnosis.setDiagnosis(diagnosisCreateDTO.getDiagnosis());

            this.diagnosisRepository.save(diagnosis);

        } catch (Exception e) {
            throw new RuntimeException("Could not verify email. AuthService might be down or wrong email.");
        }
    }
}
