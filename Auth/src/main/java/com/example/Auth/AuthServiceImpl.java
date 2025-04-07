package com.example.Auth;

import com.example.Auth.DTO.*;
import com.example.Auth.EmailService.EmailService;
import com.example.Auth.ExceptionHandlers.InvalidUserInputException;
import com.example.Auth.ExceptionHandlers.UnauthorizedActionException;
import com.example.Auth.ExceptionHandlers.UserNotFoundException;
import com.example.Auth.JWT.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthRepository authRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final StreamBridge streamBridge;

    @Autowired
    public AuthServiceImpl(PasswordEncoder passwordEncoder, AuthRepository authRepository, EmailService emailService, JwtService jwtService,StreamBridge streamBridge) {
        this.authRepository = authRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.streamBridge = streamBridge;
    }

    @Override
    public AuthEntity findById(int id) {
        return authRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User Not Found with id: " + id));
    }

    @Override
    public AuthEntity findByEmail(String email) {
        return authRepository.findByEmail(email);
    }

    @Override
    public AuthEntity save(AuthEntity entity) {
        if (entity.getEmail().isEmpty() || entity.getPassword().isEmpty() || entity.getRole().isEmpty()){
            throw new InvalidUserInputException("Please fill all the information!");
        }
        return authRepository.save(entity);
    }

    @Override
    public AuthEntity update(int id,AuthEntity entity) {
        AuthEntity authEntity = findById(id);

        if(entity.getEmail() != null ){
            authEntity.setEmail(entity.getEmail());
        }
        if(entity.getPassword()!= null ){
            authEntity.setPassword(entity.getPassword());
        }
        if(entity.getRole() != null ){
            authEntity.setRole(entity.getRole());
        }
        return authRepository.save(authEntity);
    }

    @Override
    public void delete(int id) {
        if (!authRepository.existsById(id)) {
            throw new UserNotFoundException("User Not Found with id: " + id);
        }
        authRepository.deleteById(id);
    }

    @Override
    public void signup(SignupDTO signupDTO) {

        AuthEntity userEntity = authRepository.findByEmail(signupDTO.getEmail());
        System.out.println(userEntity);

        if (userEntity != null) {
            throw new InvalidUserInputException("Email is already taken");
        }

        String encryptedPassword = passwordEncoder.encode(signupDTO.getPassword());
        String confirmationCode; confirmationCode = UUID.randomUUID().toString().substring(0, 6);

        AuthEntity user = new AuthEntity();
        user.setEmail(signupDTO.getEmail());
        user.setPassword(encryptedPassword);
        user.setConfirmationCode(confirmationCode);
        user.setConfirmationCodeExpiry(LocalDateTime.now().plusMinutes(10));

        UserCreatedEvent userCreatedEvent = new UserCreatedEvent();
        userCreatedEvent.setUserId(user.getId());
        userCreatedEvent.setFirstName(signupDTO.getFirstName());
        userCreatedEvent.setLastName(signupDTO.getLastName());
        streamBridge.send("userCreated-out-0", userCreatedEvent);

        authRepository.save(user);
        emailService.sendConfirmationEmail(signupDTO.getEmail(), confirmationCode);
    }

    @Override
    public AuthResponse login(LoginDTO loginDTO) {

        AuthEntity userEntity = authRepository.findByEmail(loginDTO.getEmail());

        if(userEntity == null) {
            throw new UserNotFoundException("User not found");
        }

        if(userEntity.getEmailConfirmation()==0){
            throw new UnauthorizedActionException("Email Confirmation not valid please confirm the email");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), userEntity.getPassword())) {
            throw new UnauthorizedActionException("Invalid credentials");
        }
        String userId=String.valueOf(userEntity.getId());
        String token = this.jwtService.generateToken(userId, userEntity.getEmail(), userEntity.getRole());
        String refreshToken = jwtService.generateRefreshToken(userId, userEntity.getEmail());

        return new AuthResponse(token, refreshToken);
    }

    @Override
    public AuthResponse verifyEmail(EmailConfirmationRequest request) {

            AuthEntity user = authRepository.findByEmail(request.getEmail());

            if (!user.getConfirmationCode().equals(request.getCode())) {
                throw new RuntimeException("Invalid confirmation code");
            }

            if (user.getConfirmationCodeExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Confirmation code has expired. Please request a new one.");
            }

            user.setEmailConfirmation(1);
            user.setConfirmationCode(null);  // Remove code after confirmation
            user.setConfirmationCodeExpiry(null);
            authRepository.save(user);

            String userId=String.valueOf(user.getId());
            String token = this.jwtService.generateToken(userId, user.getEmail(), user.getRole());
            String refreshToken = jwtService.generateRefreshToken(userId, user.getEmail());


        return new AuthResponse(token,refreshToken);
        }
    }
