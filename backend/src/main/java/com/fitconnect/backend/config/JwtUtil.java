package com.fitconnect.backend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // IMPORTANTE: En un entorno de producción real, esto no se pone en el código, 
    // sino en las variables de entorno del servidor.
    // Para Bcrypt/HS256 necesitamos una clave de al menos 32 caracteres (256 bits).
    private final String SECRET_KEY = "FitConnectSuperSecretKeyForJwtTokens2026_TFG";
    
    // Tiempo de validez del token: 24 horas (en milisegundos)
    private final long EXPIRATION_TIME = 86400000; 

    // Genera la clave encriptada que usará el algoritmo
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    /**
     * MÉTODO 1: FABRICAR EL TOKEN
     * Se llama cuando el usuario hace Login correctamente.
     */
    public String generarToken(String email) {
        return Jwts.builder()
                .subject(email) // El "dueño" del token será el email
                .issuedAt(new Date()) // Fecha de creación
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Fecha de caducidad
                .signWith(getSigningKey()) // Lo firmamos criptográficamente
                .compact();
    }

    /**
     * MÉTODO 2: EXTRAER EL EMAIL
     * Sirve para saber quién está haciendo la petición leyendo su token.
     */
    public String extraerEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * MÉTODO 3: VALIDAR EL TOKEN
     * Comprueba que el token no ha sido manipulado por un hacker y no ha caducado.
     */
    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false; // Si falla la firma o está caducado, devuelve false
        }
    }
}