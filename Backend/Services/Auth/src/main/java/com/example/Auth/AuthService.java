package com.example.Auth;

import com.example.Auth.DTO.*;

import java.util.List;

public interface AuthService {
    AuthEntity findById(int id);
    AuthEntity findByEmail(String email);
    AuthEntity save(AuthEntity entity);
    AuthEntity update(int id,AuthEntity entity);
    void delete(int id);
    void signup(SignupDTO signupDTO);
    void login(LoginDTO loginDTO);
    AuthResponse verifyEmail(EmailConfirmationRequest request);
    Integer verifyEmailForDiagnosis(String email);
    AuthResponse refreshToken (RefreshTokenRequest request);
    String addRefreshFcmTokenDto(int userId,FcmTokenDTO fcmTokenDTO);
    String getUserFcmToken(String email);
    String getUserFcmToken2(int id);
    String deleteFcmToken(int id);
    String getUserEmail(int id);
    List<AuthEntity> getAllDoctors();
    List<AuthEntity> getAllUsers();
}
