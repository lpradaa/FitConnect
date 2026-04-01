package com.fitconnect.backend.controllers;

import com.fitconnect.backend.config.JwtUtil;
import com.fitconnect.backend.dtos.AuthResponseDTO;
import com.fitconnect.backend.dtos.UsuarioLoginDTO;
import com.fitconnect.backend.models.Usuario;
import com.fitconnect.backend.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth") // Ruta específica para todo lo relacionado con sesión
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Inyectamos las 3 herramientas que necesitamos
    public AuthController(UsuarioService usuarioService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioLoginDTO loginDTO) {
        
        // 1. Buscamos en la base de datos si hay alguien con ese email
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(loginDTO.getEmail());

        // 2. Si el usuario existe, comprobamos su contraseña
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            // passwordEncoder.matches compara la clave en texto plano con el hash guardado
            if (passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
                
                // 3. ¡Credenciales correctas! Generamos el Token JWT
                String token = jwtUtil.generarToken(usuario.getEmail());
                
                // 4. Empaquetamos la respuesta en el DTO
                AuthResponseDTO respuesta = new AuthResponseDTO(
                        token,
                        usuario.getId(),
                        usuario.getEmail(),
                        usuario.getNombre()
                );
                
                // Devolvemos un 200 OK con el token y los datos del usuario
                return ResponseEntity.ok(respuesta);
            }
        }

        // 5. Si llegamos aquí (no existe el email o falla la clave), devolvemos el error genérico
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Credenciales inválidas.");
    }
}
