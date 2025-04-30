package com.example.Auth.JWT;

public interface RefreshTokenService {

    RefreshTokenEntity findByUserId(int userId);
    void updateRefreshToken(int id,RefreshTokenEntity refreshTokenEntity);
    void saveRefreshToken(RefreshTokenEntity refreshTokenEntity);
}
