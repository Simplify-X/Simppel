package com.X.X.token;

import com.X.X.users.data.user;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;


@Service
public class TokenServices {
    @Value("${jwt.secret}")
    private String jwtSecret;


    public String generateTokenUser(user user,Boolean remember) {
        Date date = null;
        if(remember){
             date = Date.from(Instant.now().plus(3, ChronoUnit.DAYS));
        }
        else {
             date = Date.from(Instant.now().plus(2, ChronoUnit.HOURS));
        }
        String jws = Jwts.builder().
                setSubject(user.getEmail()).
                setExpiration(date).
                signWith(SignatureAlgorithm.HS256, jwtSecret).compact();
        return jws;
    }
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }



    public String getMail(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }


}