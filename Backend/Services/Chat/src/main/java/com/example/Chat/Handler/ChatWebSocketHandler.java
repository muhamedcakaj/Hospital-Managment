package com.example.Chat.Handler;

import com.example.Chat.Entity.ChatMessage;
import com.example.Chat.Service.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ChatService chatService;
    private final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(ObjectMapper mapper, ChatService service) {
        this.objectMapper = mapper;
        this.chatService = service;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = extractUserId(session);
        activeSessions.put(userId, session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage msg) throws Exception {
        ChatMessage message = objectMapper.readValue(msg.getPayload(), ChatMessage.class);
        chatService.saveMessage(message);

        WebSocketSession receiver = activeSessions.get(message.getReceiverId());
        if (receiver != null && receiver.isOpen()) {
            receiver.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        }
    }

    private String extractUserId(WebSocketSession session) {
        String query = session.getUri().getQuery(); // ?userId=abc
        return query.split("=")[1];
    }
}
