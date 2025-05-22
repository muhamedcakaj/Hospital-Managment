package com.example.Chat.Controller;

import com.example.Chat.Entity.ChatMessage;
import com.example.Chat.Entity.ChatPreview;
import com.example.Chat.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService service;

    @Autowired
    public ChatController(ChatService service) {
        this.service = service;
    }

    @GetMapping("/conversations/{userId}")
    public List<ChatPreview> getConversations(@PathVariable String userId) {
        return service.getConversations(userId);
    }

    @GetMapping("/messages/{user1}/{user2}")
    public List<ChatMessage> getChatHistory(@PathVariable String user1, @PathVariable String user2) {
        return service.getChatHistory(user1, user2);
    }
}