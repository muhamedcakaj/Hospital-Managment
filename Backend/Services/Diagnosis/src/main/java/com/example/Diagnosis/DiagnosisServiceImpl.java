package com.example.Diagnosis;

import com.example.Diagnosis.DTO.DiagnosisCreateDTO;
import com.example.Diagnosis.ExceptionHandlers.InvalidUserInputException;
import com.example.Diagnosis.ExceptionHandlers.UserNotFoundException;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class DiagnosisServiceImpl implements DiagnosisService{

    private final DiagnosisRepository diagnosisRepository;
    RestTemplate restTemplate;

    @Value("${auth-service.verify-email-url}")
    private String verifyEmailUrl;

    @Value("${auth-service.fcm-token-url}")
    private String fcmTokenUrl;

    @Autowired
    public DiagnosisServiceImpl(DiagnosisRepository diagnosisRepository,RestTemplate restTemplate) {
        this.diagnosisRepository = diagnosisRepository;
        this.restTemplate = restTemplate;
    }
    public DiagnosisEntity findById(int id) {
        return this.diagnosisRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Diagnosis not found"));
    }
    @Override
    public List<DiagnosisEntity> findByUserId(int userId) {
        if(userId<=0){
            throw new InvalidUserInputException("Invalid or unregistered user.");
        }
        return this.diagnosisRepository.findByUserId(userId);
    }

    @Override
    public List<DiagnosisEntity> findByDoctorId(int doctorId) {
        if(doctorId<=0){
            throw new InvalidUserInputException("Invalid or unregistered doctor.");
        }
        return this.diagnosisRepository.findByDoctorId(doctorId);
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

            String fcmTokenUrl = this.fcmTokenUrl + diagnosisCreateDTO.getUserEmail();
            ResponseEntity<String> response = restTemplate.getForEntity(fcmTokenUrl, String.class);
            String fcmToken = response.getBody();
            System.out.println("FCMTOKEN :"+fcmToken);

            if (fcmToken != null && !fcmToken.isBlank() && !fcmToken.equals("null")) {
                sendPushNotification(fcmToken, "New Diagnosis", "You have a new diagnosis from your doctor.");
            }

        } catch (Exception e) {
            throw new RuntimeException("Could not verify email. AuthService might be down or wrong email.");
        }
    }

    public DiagnosisEntity updateDiagnosis(int id, DiagnosisEntity diagnosisEntity) {
        DiagnosisEntity diagnosis = findById(id);

        if(diagnosisEntity.getDiagnosis() != null){
            diagnosis.setDiagnosis(diagnosisEntity.getDiagnosis());
        }

        return this.diagnosisRepository.save(diagnosis);
    }

    @Override
    public void deleteDiagnosisById(int diagnosisId) {
        if(diagnosisId<=0){
            throw new InvalidUserInputException("Invalid or unregistered diagnosis.");
        }
        this.diagnosisRepository.deleteById(diagnosisId);
    }

    @Async
    protected void sendPushNotification(String fcmToken, String title, String body) {
        try {
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Successfully sent FCM notification: " + response);
        } catch (FirebaseMessagingException e) {
            System.err.println("Error sending FCM notification: " + e.getMessage());
        }
    }
}
