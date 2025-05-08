package com.example.Chat.Repository;

import com.example.Chat.Entity.ChatPreview;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatPreviewRepository extends MongoRepository<ChatPreview, String> {
    List<ChatPreview> findByUserId1OrUserId2OrderByLastUpdatedDesc(String userId1, String userId2);
}