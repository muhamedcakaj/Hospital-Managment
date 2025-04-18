package com.example.Spring_Cloud_Gateway;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    // Public endpoints
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/login", "/auth/signup", "/auth/confirmEmail"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // 1. Allow public endpoints
        if (isPublicEndpoint(path)) {
            return chain.filter(exchange);
        }

        // 2. Check for Authorization header
        List<String> authHeaders = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (authHeaders == null || authHeaders.isEmpty() || !authHeaders.get(0).startsWith("Bearer ")) {
            return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeaders.get(0).substring(7);
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String role = claims.get("role", String.class);
            String userId = claims.getSubject();

            // 3. Optionally check role-based access (example)
            if (path.startsWith("/admin/") && !role.equals("Admin")) {
                return onError(exchange, "Forbidden: Admins only", HttpStatus.FORBIDDEN);
            }
            if(path.startsWith("/users/")&& !role.equals("User")) {
                return onError(exchange, "Forbidden: Users only", HttpStatus.FORBIDDEN);
            }
            if(path.startsWith("/doctors/")&& !role.equals("Doctor")) {
                return onError(exchange, "Forbidden: Doctors only", HttpStatus.FORBIDDEN);
            }
            if(path.startsWith("/diagnosis/doctor")&& !role.equals("Doctor")) {
                return onError(exchange,"Forbidden : Doctors only",HttpStatus.FORBIDDEN);
            }
            // 4. Add claims to request headers (optional)
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-Id", userId)
                    .header("X-Email", claims.get("email", String.class))
                    .header("X-Role", role)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            return onError(exchange, "Invalid or expired JWT token", HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isPublicEndpoint(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        return exchange.getResponse().setComplete();
    }
}
