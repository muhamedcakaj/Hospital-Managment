package com.example.Auth;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<AuthEntity, Integer> {
    AuthEntity findByEmail(String email);
    List<AuthEntity> findByRole(String role);
}
