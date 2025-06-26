package com.example.Appointment;

import com.example.Appointment.DTO.AppointmentCreateDTO;
import com.example.Appointment.DTO.DoctorPersonalInfoDTO;
import com.example.Appointment.DTO.UserPersonalInfoDTO;
import com.example.Appointment.EmailService.EmailService;
import com.example.Appointment.FireBase.FcmNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final FcmNotificationService fcmNotificationService;

    @Value("${auth-service.fcm-token-url}")
    private String fcmTokenUrl;

    RestTemplate restTemplate;

    @Value("${doctor-service.getDoctor-info-url}")
    private String getDoctorPersonalInfoUrl;

    @Value("${user-service.getUser-info-url}")
    private String getUserPersonalInfoUrl;

    @Value("${auth-service.getUser-email-url}")
    private String getUserEmailUrl;

    private EmailService emailService;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,FcmNotificationService fcmNotificationService,RestTemplate restTemplate,EmailService emailService) {
        this.restTemplate=restTemplate;
        this.appointmentRepository = appointmentRepository;
        this.fcmNotificationService=fcmNotificationService;
        this.emailService=emailService;

    }

    public void createAppointment(AppointmentCreateDTO dto) {
        LocalDate today = LocalDate.now();
        LocalTime startTime = LocalTime.of(8, 0);
        LocalTime endTime = LocalTime.of(16, 0);

        if (dto.getLocalDate().isBefore(today)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot create appointment in the past.");
        }

        LocalTime time = dto.getLocalTime();
        if (time.isBefore(startTime) || time.isAfter(endTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment must be between 08:00 and 16:00.");
        }

        /*boolean alreadyBooked = appointmentRepository.existsByDoctorIdAndLocalDateAndLocalTime(dto.getDoctorId(), dto.getLocalDate(), dto.getLocalTime());
        //if (alreadyBooked) {
           //throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This time slot is already booked.");
       }*/

        //Get Doctor PersonalInfo
        String getDoctorPersonalInfoUrl = this.getDoctorPersonalInfoUrl + dto.getDoctorId();
        ResponseEntity<DoctorPersonalInfoDTO> doctorInfoResponse = restTemplate.getForEntity(getDoctorPersonalInfoUrl, DoctorPersonalInfoDTO.class);
        DoctorPersonalInfoDTO doctorPersonalInfoDTO = doctorInfoResponse.getBody();

        //Get User Personal Data
        String getUserPersonalInfoUrl = this.getUserPersonalInfoUrl + dto.getUserId();
        ResponseEntity<UserPersonalInfoDTO> userInfoResponse = restTemplate.getForEntity(getUserPersonalInfoUrl, UserPersonalInfoDTO.class);
        UserPersonalInfoDTO userPersonalInfoDTO = userInfoResponse.getBody();

        //Get User Email
        String getUserEmailUrl = this.getUserEmailUrl + dto.getUserId();
        ResponseEntity<String> userEmailResponse = restTemplate.getForEntity(getUserEmailUrl, String.class);
        String userEmail = userEmailResponse.getBody();

        AppointmentEntity appointment = new AppointmentEntity();

        appointment.setDoctorId(dto.getDoctorId());
        appointment.setDoctorName(doctorPersonalInfoDTO.getFirst_name());
        appointment.setDoctorSurname(doctorPersonalInfoDTO.getLast_name());

        appointment.setUserId(dto.getUserId());
        appointment.setUserEmail(userEmail);
        appointment.setUserName(userPersonalInfoDTO.getFirst_name());
        appointment.setUserSurname(userPersonalInfoDTO.getSecond_name());

        appointment.setLocalDate(dto.getLocalDate());
        appointment.setLocalTime(dto.getLocalTime());

        appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentEntity> findAppointmentByDoctorId(int doctorId) {
        return this.appointmentRepository.findAppointmentsByDoctorIdOrderByLocalDateDescLocalTimeDesc(doctorId);
    }

    @Override
    public List<AppointmentEntity> findAppointmentsByUserId(int userId) {
        return this.appointmentRepository.findAppointmentsByUserIdOrderByLocalDateDescLocalTimeDesc(userId);
    }

    @Override
    public void updateStatus(int id, String newStatus) {
        AppointmentEntity appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        this.emailService.sendConfirmationEmail(appointment.getUserEmail(), newStatus);

        appointment.setAppointemntStatus(newStatus);
        appointmentRepository.save(appointment);

        String fcmTokenUrl = this.fcmTokenUrl + appointment.getUserId();
        ResponseEntity<String> response = restTemplate.getForEntity(fcmTokenUrl, String.class);
        String fcmToken = response.getBody();
        if (fcmToken != null && !fcmToken.isBlank() && !fcmToken.equals("null")) {
            this.fcmNotificationService.sendPushNotification(fcmToken, "Appointment Status Set", "The doctor has set your status appointment to : "+appointment.getAppointemntStatus());
        }

    }
}
