package com.example.Auth;

import com.example.Auth.DTO.AuthResponse;
import com.example.Auth.DTO.EmailConfirmationRequest;
import com.example.Auth.DTO.LoginDTO;
import com.example.Auth.DTO.SignupDTO;

public interface AuthService {
    AuthEntity findById(int id);
    AuthEntity findByEmail(String email);
    AuthEntity save(AuthEntity entity);
    AuthEntity update(int id,AuthEntity entity);
    void delete(int id);
    void signup(SignupDTO signupDTO);
    AuthResponse login(LoginDTO loginDTO);
    AuthResponse verifyEmail(EmailConfirmationRequest request);
    Integer verifyEmailForDiagnosis(String email);
}
