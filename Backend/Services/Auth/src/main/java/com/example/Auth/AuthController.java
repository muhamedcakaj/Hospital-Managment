package com.example.Auth;


import com.example.Auth.DTO.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        authService.login(loginDTO);
        return ResponseEntity.ok("Login successful. Please verify your email.");
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
    @GetMapping("/getUserFcmToken/{email}")
    public ResponseEntity<String>getUserFcmToken(@PathVariable("email") String email){
        return ResponseEntity.ok(this.authService.getUserFcmToken(email));
    }
    @GetMapping("/getUserFcmToken/id/{id}")
    public ResponseEntity<String>getUserFcmToken2(@PathVariable("id") int id){
        return ResponseEntity.ok(this.authService.getUserFcmToken2(id));
    }
    @GetMapping("/getUserEmail/{id}")
    public ResponseEntity<String>getUserEmail(@PathVariable("id") int id){
        return ResponseEntity.ok(this.authService.getUserEmail(id));
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(this.authService.refreshToken(request));
    }
    @PutMapping("/addFcmToken/{id}")
    public ResponseEntity<String>addRefreshFcmTokenDto(@PathVariable("id")int userId,@RequestBody FcmTokenDTO fcmTokenDTO) {
        return ResponseEntity.ok(this.authService.addRefreshFcmTokenDto(userId,fcmTokenDTO));
    }
    @PutMapping("/deleteFcmToken/{id}")
    public ResponseEntity<String>deleteFcmToken(@PathVariable("id") int userId){
        return ResponseEntity.ok(this.authService.deleteFcmToken(userId));
    }
    @GetMapping("/admin/getAllDoctors")
    public ResponseEntity<List<AuthEntity>>getAllDoctors(){
        return ResponseEntity.ok(this.authService.getAllDoctors());
    }
    @GetMapping("admin/getAllUsers")
    public ResponseEntity<List<AuthEntity>>getAllUsers(){
        return ResponseEntity.ok(this.authService.getAllUsers());
    }
}
