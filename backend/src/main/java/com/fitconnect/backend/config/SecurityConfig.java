package com.fitconnect.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; // 👈 Importación necesaria
import java.util.List; // 👈 Importación necesaria

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // 1. Desactivamos CSRF porque usamos tokens JWT de forma stateless
        .csrf(csrf -> csrf.disable())
        
        // 2. Configuramos el CORS para que Angular pueda hablar con Spring Boot
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
        
        // 3. Filtramos las rutas protegidas y públicas
        .authorizeHttpRequests(auth -> auth
            // Permitimos el login y registro sin token
            .requestMatchers("/api/auth/**", "/api/usuarios/registro").permitAll()
            
            // 🚫 AQUÍ ESTÁ EL RECORTE: Asegúrate de que las rutas de usuarios y matches requieran autenticación global
            .requestMatchers("/api/usuarios/**").authenticated() 
            
            // Cualquier otra petición necesitará estar logueado
            .anyRequest().authenticated()
        )
        
        // 4. Añadimos vuestro filtro de JWT para que lea la cabecera 'Authorization'
        // (Asegúrate de que esta línea esté puesta para que Spring Security valide el token que envía Angular)
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}


    @org.springframework.context.annotation.Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = 
                new org.springframework.web.cors.CorsConfiguration();
        
        // 1. Ponemos la URL exacta de tu Angular explícitamente (NADA de asteriscos aquí si hay credentials)
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:4200")); 
        
        // 2. Autorizamos los métodos estándar
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 3. Autorizamos las cabeceras críticas (especialmente Authorization para vuestro JWT)
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Cache-Control", "Content-Type"));
        
        // 4. Mantenemos las credenciales activas de forma segura para localhost:4200
        configuration.setAllowCredentials(true);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = 
                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    
}