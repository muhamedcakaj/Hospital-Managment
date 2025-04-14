package com.example.Auth;


import com.example.Auth.DTO.AuthResponse;
import com.example.Auth.DTO.EmailConfirmationRequest;
import com.example.Auth.DTO.LoginDTO;
import com.example.Auth.DTO.SignupDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupDTO signupDTO) {
        authService.signup(signupDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully. Please verify your email.");
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO) {
        AuthResponse response = authService.login(loginDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirmEmail")
    public ResponseEntity<AuthResponse> confirmEmail(@RequestBody EmailConfirmationRequest request) {
        AuthResponse response = authService.verifyEmail(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verifyEmail/diagnosis")
    public ResponseEntity<Integer> verifyEmailForDiagnosis(@RequestParam String email) {
        return ResponseEntity.ok(this.authService.verifyEmailForDiagnosis(email));
    }


}
