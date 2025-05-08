package com.example.Chat.ServiceImpl;

import com.example.Chat.Entity.ChatMessage;
import com.example.Chat.Entity.ChatPreview;
import com.example.Chat.Repository.ChatMessageRepository;
import com.example.Chat.Repository.ChatPreviewRepository;
import com.example.Chat.Service.ChatService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository messageRepo;
    private final ChatPreviewRepository previewRepo;

    public ChatServiceImpl(ChatMessageRepository mRepo, ChatPreviewRepository pRepo) {
        this.messageRepo = mRepo;
        this.previewRepo = pRepo;
    }

    public void saveMessage(ChatMessage msg) {
        msg.setTimestamp(LocalDateTime.now());
        messageRepo.save(msg);

        // Update chat preview
        String uid1 = msg.getSenderId();
        String uid2 = msg.getReceiverId();

        Optional<ChatPreview> existing = previewRepo
                .findByUserId1OrUserId2OrderByLastUpdatedDesc(uid1, uid2)
                .stream()
                .filter(p -> (p.getUserId1().equals(uid1) && p.getUserId2().equals(uid2)) ||
                        (p.getUserId1().equals(uid2) && p.getUserId2().equals(uid1)))
                .findFirst();

        ChatPreview preview = existing.orElse(new ChatPreview());
        preview.setUserId1(uid1);
        preview.setUserId2(uid2);
        preview.setLastMessage(msg.getContent());
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