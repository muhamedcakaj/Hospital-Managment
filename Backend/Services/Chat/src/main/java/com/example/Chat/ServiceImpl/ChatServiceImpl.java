package com.example.Chat.ServiceImpl;

import com.example.Chat.DTO.DoctorPersonalInfoDTO;
import com.example.Chat.DTO.UserPersonalInfoDTO;
import com.example.Chat.Entity.ChatMessage;
import com.example.Chat.Entity.ChatPreview;
import com.example.Chat.FireBase.FcmNotificationService;
import com.example.Chat.Repository.ChatMessageRepository;
import com.example.Chat.Repository.ChatPreviewRepository;
import com.example.Chat.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepo;
    private final ChatPreviewRepository previewRepo;
    private final FcmNotificationService fcmNotificationService;
    RestTemplate restTemplate;

    @Value("${auth-service.fcm-token-url}")
    private String fcmTokenUrl;

    @Value("${doctor-service.getDoctor-info-url}")
    private String getDoctorPersonalInfoUrl;

    @Value("${user-service.getUser-info-url}")
    private String getUserPersonalInfoUrl;


    @Autowired
    public ChatServiceImpl(ChatMessageRepository mRepo, ChatPreviewRepository pRepo,FcmNotificationService fcmNotificationService,RestTemplate restTemplate) {
        this.messageRepo = mRepo;
        this.previewRepo = pRepo;
        this.fcmNotificationService=fcmNotificationService;
        this.restTemplate = restTemplate;
    }

    public void saveMessage(ChatMessage msg) {
        msg.setTimestamp(LocalDateTime.now());
        messageRepo.save(msg);

        String fcmTokenUrl = this.fcmTokenUrl + msg.getReceiverId();
        ResponseEntity<String> response = restTemplate.getForEntity(fcmTokenUrl, String.class);
        String fcmToken = response.getBody();
        if (fcmToken != null && !fcmToken.isBlank() && !fcmToken.equals("null")) {
            this.fcmNotificationService.sendPushNotification(fcmToken, "New Message : ",msg.getContent());
        }

        String uid1 = msg.getSenderId();
        String uid2 = msg.getReceiverId();
        String normalizedUser1 = uid1.compareTo(uid2) < 0 ? uid1 : uid2;
        String normalizedUser2 = uid1.compareTo(uid2) < 0 ? uid2 : uid1;

        // Try to find existing preview using normalized IDs
        Optional<ChatPreview> existing = previewRepo.findByUserId1AndUserId2(normalizedUser1, normalizedUser2);

        ChatPreview preview = existing.orElse(new ChatPreview());

        DoctorPersonalInfoDTO doctorPersonalInfoDTO = null;
        try {
            doctorPersonalInfoDTO = restTemplate.getForObject(this.getDoctorPersonalInfoUrl + normalizedUser1, DoctorPersonalInfoDTO.class);
        } catch (Exception ignored) {}

        if (doctorPersonalInfoDTO != null && doctorPersonalInfoDTO.getFirst_name() != null) {
            preview.setDoctorName(doctorPersonalInfoDTO.getFirst_name());
            preview.setDoctorSurname(doctorPersonalInfoDTO.getLast_name());
        } else {
            doctorPersonalInfoDTO = restTemplate.getForObject(this.getDoctorPersonalInfoUrl + normalizedUser2, DoctorPersonalInfoDTO.class);
            if (doctorPersonalInfoDTO != null) {
                preview.setDoctorName(doctorPersonalInfoDTO.getFirst_name());
                preview.setDoctorSurname(doctorPersonalInfoDTO.getLast_name());
            }
        }

        UserPersonalInfoDTO userPersonalInfoDTO = null;
        try {
            userPersonalInfoDTO = restTemplate.getForObject(this.getUserPersonalInfoUrl + normalizedUser1, UserPersonalInfoDTO.class);
        } catch (Exception ignored) {}

        if (userPersonalInfoDTO != null && userPersonalInfoDTO.getFirst_name() != null) {
            preview.setPatientName(userPersonalInfoDTO.getFirst_name());
            preview.setPatientSurname(userPersonalInfoDTO.getSecond_name());
        } else {
            userPersonalInfoDTO = restTemplate.getForObject(this.getUserPersonalInfoUrl + normalizedUser2, UserPersonalInfoDTO.class);
            if (userPersonalInfoDTO != null) {
                preview.setPatientName(userPersonalInfoDTO.getFirst_name());
                preview.setPatientSurname(userPersonalInfoDTO.getSecond_name());
            }
        }
        preview.setUserId1(normalizedUser1);
        preview.setUserId2(normalizedUser2);
        preview.setLastMessage(msg.getContent());
        preview.setLastSenderId(uid1);
        preview.setLastUpdated(LocalDateTime.now());

        previewRepo.save(preview);
    }

    public List<ChatMessage> getChatHistory(String u1, String u2) {
        return messageRepo.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestamp(u1, u2, u1, u2);
    }

    public List<ChatPreview> getConversations(String userId) {
        return previewRepo.findByUserId1OrUserId2OrderByLastUpdatedDesc(userId, userId);
    }
}