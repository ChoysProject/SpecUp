package com.spec.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import jakarta.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    // base64 인코딩된 시크릿키 (예: echo -n 'specup_secret_key' | base64)
    // @Value("${jwt.secret}")
    private String SECRET_KEY = "c3BlY3VwX3NlY3JldF9rZXlfMjAyNF9zdXBlcl9sb25nX2Zvcl9qd3Qh";
    // @Value("${jwt.expiration}")
    private long EXPIRATION_TIME = 900000;

    public String createToken(String email, List<String> roles) {
        Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));
        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 여기서 15분 적용
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    public boolean validateToken(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Authentication getAuthentication(String token) {
        Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_KEY));
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        String email = claims.getSubject();
        List<String> roles = claims.get("roles", List.class);
        if (roles == null) {
            roles = java.util.Arrays.asList("ROLE_USER");
        }
        return new UsernamePasswordAuthenticationToken(email, "", roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
    }
}