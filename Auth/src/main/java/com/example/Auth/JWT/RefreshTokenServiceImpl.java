package com.example.Auth.JWT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshTokenEntity findByUserId(int userId) {
        return refreshTokenRepository.findByUserId(userId);
    }

    public void updateRefreshToken(int id,RefreshTokenEntity refreshTokenEntity) {
        RefreshTokenEntity refreshToken = findByUserId(id);

        refreshToken.setRefreshToken(refreshTokenEntity.getRefreshToken());

        refreshTokenRepository.save(refreshToken);
    }

    @Override
    public void saveRefreshToken(RefreshTokenEntity refreshTokenEntity) {
        this.refreshTokenRepository.save(refreshTokenEntity);
    }
}
