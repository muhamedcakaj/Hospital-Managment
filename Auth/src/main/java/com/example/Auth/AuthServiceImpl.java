package com.example.Auth;

import com.example.Auth.DTO.EmailConfirmationRequest;
import com.example.Auth.DTO.LoginDTO;
import com.example.Auth.DTO.SignupDTO;
import com.example.Auth.EmailService.EmailService;
import com.example.Auth.ExceptionHandlers.InvalidUserInputException;
import com.example.Auth.ExceptionHandlers.UnauthorizedActionException;
import com.example.Auth.ExceptionHandlers.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthRepository authRepository;
    private final EmailService emailService;

    @Autowired
    public AuthServiceImpl(PasswordEncoder passwordEncoder, AuthRepository authRepository, EmailService emailService) {
        this.passwordEncoder = passwordEncoder;
        this.authRepository = authRepository;
        this.emailService = emailService;
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

        authRepository.save(user);

        emailService.sendConfirmationEmail(signupDTO.getEmail(), confirmationCode);
    }

    @Override
    public String login(LoginDTO loginDTO) {

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

        return "Sucessfully logged in";
    }

    @Override
    public String verifyEmail(EmailConfirmationRequest request) {

            AuthEntity user = authRepository.findByEmail(request.getEmail());

            if (user.getEmailConfirmation() == 1) {
                throw new RuntimeException("Email is already confirmed");
            }

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

            return "Email successfully confirmed!";
        }
    }
