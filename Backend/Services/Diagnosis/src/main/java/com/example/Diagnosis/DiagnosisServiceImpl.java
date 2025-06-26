package com.example.Diagnosis;

import com.example.Diagnosis.DTO.DiagnosisCreateDTO;
import com.example.Diagnosis.DTO.DoctorPersonalInfoDTO;
import com.example.Diagnosis.DTO.UserPersonalInfoDTO;
import com.example.Diagnosis.EmailService.EmailService;
import com.example.Diagnosis.ExceptionHandlers.InvalidUserInputException;
import com.example.Diagnosis.ExceptionHandlers.UserNotFoundException;
import com.example.Diagnosis.FireBase.FcmNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class DiagnosisServiceImpl implements DiagnosisService{

    private final DiagnosisRepository diagnosisRepository;
    RestTemplate restTemplate;
    private final FcmNotificationService fcmNotificationService;


    @Value("${auth-service.verify-email-url}")
    private String verifyEmailUrl;

    @Value("${auth-service.fcm-token-url}")
    private String fcmTokenUrl;

    @Value("${doctor-service.getDoctor-info-url}")
    private String getDoctorPersonalInfoUrl;

    @Value("${user-service.getUser-info-url}")
    private String getUserPersonalInfoUrl;

    private final EmailService emailService;

    @Autowired
    public DiagnosisServiceImpl(DiagnosisRepository diagnosisRepository, RestTemplate restTemplate, FcmNotificationService fcmNotificationService,EmailService emailService) {
        this.diagnosisRepository = diagnosisRepository;
        this.restTemplate = restTemplate;
        this.fcmNotificationService = fcmNotificationService;
        this.emailService=emailService;
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
            //Send Email
            this.emailService.sendConfirmationEmail(diagnosisCreateDTO.getUserEmail(), diagnosisCreateDTO.getDiagnosis());

            //Get Doctor PersonalInfo
            String getDoctorPersonalInfoUrl = this.getDoctorPersonalInfoUrl + diagnosisCreateDTO.getDoctorId();
            ResponseEntity<DoctorPersonalInfoDTO> doctorInfoResponse = restTemplate.getForEntity(getDoctorPersonalInfoUrl, DoctorPersonalInfoDTO.class);
            DoctorPersonalInfoDTO doctorPersonalInfoDTO = doctorInfoResponse.getBody();

            //Get User Personal Data
            String getUserPersonalInfoUrl = this.getUserPersonalInfoUrl + userId;
            ResponseEntity<UserPersonalInfoDTO> userInfoResponse = restTemplate.getForEntity(getUserPersonalInfoUrl, UserPersonalInfoDTO.class);
            UserPersonalInfoDTO userPersonalInfoDTO = userInfoResponse.getBody();
            //Saving in database
            DiagnosisEntity diagnosis = new DiagnosisEntity();

            diagnosis.setDoctorId(diagnosisCreateDTO.getDoctorId());
            diagnosis.setDoctorName(doctorPersonalInfoDTO.getFirst_name());
            diagnosis.setDoctorSurname(doctorPersonalInfoDTO.getLast_name());

            diagnosis.setUserId(userId);
            diagnosis.setUserName(userPersonalInfoDTO.getFirst_name());
            diagnosis.setUserSurname(userPersonalInfoDTO.getSecond_name());

            diagnosis.setDiagnosis(diagnosisCreateDTO.getDiagnosis());

            this.diagnosisRepository.save(diagnosis);

            //Sending notifications to mobile
            String fcmTokenUrl = this.fcmTokenUrl + diagnosisCreateDTO.getUserEmail();
            ResponseEntity<String> response = restTemplate.getForEntity(fcmTokenUrl, String.class);
            String fcmToken = response.getBody();
            if (fcmToken != null && !fcmToken.isBlank() && !fcmToken.equals("null")) {
                this.fcmNotificationService.sendPushNotification(fcmToken, "New Diagnosis", "You have a new diagnosis from your doctor.");
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

}
