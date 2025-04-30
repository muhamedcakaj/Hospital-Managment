package com.example.Auth.JWT;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity,Integer> {
    RefreshTokenEntity findByUserId(int userId);
}
