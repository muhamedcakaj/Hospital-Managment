package com.example.Chat.Service;

import com.example.Chat.Entity.ChatMessage;
import com.example.Chat.Entity.ChatPreview;

import java.util.List;

public interface ChatService {

    void saveMessage(ChatMessage msg);
    List<ChatMessage> getChatHistory(String u1, String u2);
    List<ChatPreview> getConversations(String userId);
}
