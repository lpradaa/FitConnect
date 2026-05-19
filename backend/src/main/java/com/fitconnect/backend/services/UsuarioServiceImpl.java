package com.fitconnect.backend.services;

import com.fitconnect.backend.dtos.UsuarioPerfilDTO;
import com.fitconnect.backend.dtos.UsuarioRegistroDTO;
import com.fitconnect.backend.dtos.UsuarioResponseDTO;
import com.fitconnect.backend.models.Gimnasio;
import com.fitconnect.backend.models.Solicitud;
import com.fitconnect.backend.models.Usuario;
import com.fitconnect.backend.repositories.GimnasioRepository;
import com.fitconnect.backend.repositories.SolicitudRepository;
import com.fitconnect.backend.repositories.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service 
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final GimnasioRepository gimnasioRepository;
    private final SolicitudRepository solicitudRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, GimnasioRepository gimnasioRepository, SolicitudRepository solicitudRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.gimnasioRepository = gimnasioRepository;
        this.solicitudRepository = solicitudRepository;
    }

    @Override
    public UsuarioResponseDTO registrarUsuario(UsuarioRegistroDTO dto) {
        // 1. Comprobar si el email ya existe
        if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Error: El email ya está registrado en FitConnect.");
        }

        // 2. Mapear DTO a Entidad (Lo que guardaremos en base de datos)
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(dto.getNombre());
        nuevoUsuario.setEmail(dto.getEmail());
        nuevoUsuario.setEdad(dto.getEdad());
        nuevoUsuario.setGenero(dto.getGenero());
        nuevoUsuario.setPeso(dto.getPeso());
        
        // ¡Cifrado de contraseña! Bcrypt se encarga de todo 
        nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));

        // 3. Guardar en la base de datos
        Usuario guardado = usuarioRepository.save(nuevoUsuario);

        // 4. Mapear Entidad a DTO de respuesta (Lo que devolvemos a Angular, sin contraseña)
        return new UsuarioResponseDTO(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getEmail(),
                guardado.getEdad(),
                guardado.getGenero(),
                guardado.getPeso()
        );
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public UsuarioResponseDTO actualizarPerfil(String email, UsuarioPerfilDTO dto) {
        // 1. Buscamos al usuario por el email que sacamos del Token
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado en la base de datos."));

        // 2. Actualizamos sus datos básicos
        usuario.setEdad(dto.getEdad());
        usuario.setGenero(dto.getGenero());
        usuario.setPeso(dto.getPeso());
        usuario.setNivel(dto.getNivel());
        usuario.setObjetivos(dto.getObjetivos());

        // 3. Si nos envía un ID de gimnasio, lo buscamos y lo vinculamos
        if (dto.getGimnasioId() != null) {
            Gimnasio gimnasio = gimnasioRepository.findById(dto.getGimnasioId())
                    .orElseThrow(() -> new IllegalArgumentException("El gimnasio seleccionado no existe."));
            usuario.setGimnasio(gimnasio);
        }

        // 4. Guardamos los cambios
        Usuario guardado = usuarioRepository.save(usuario);

        // 5. Devolvemos el DTO de respuesta seguro
        return new UsuarioResponseDTO(
                guardado.getId(), 
                guardado.getNombre(), 
                guardado.getEmail(),
                guardado.getEdad(), 
                guardado.getGenero(), 
                guardado.getPeso(),
                guardado.getNivel(),       
                guardado.getObjetivos(),
                guardado.getGimnasio() != null ? guardado.getGimnasio().getId() : null
        );
    }

    @Override
    public List<UsuarioResponseDTO> buscarCompañeros(String email) {
        Usuario miUsuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<Usuario> matches = usuarioRepository.buscarMatches(miUsuario.getGimnasio().getId(), miUsuario.getId(), miUsuario.getNivel());

        return matches.stream().map(u -> {
            UsuarioResponseDTO dto = new UsuarioResponseDTO(u.getId(), u.getNombre(), u.getEmail(), u.getEdad(), u.getGenero(), u.getPeso(), u.getNivel(), u.getObjetivos(), u.getGimnasio() != null ? u.getGimnasio().getId() : null);
            
            // Lógica de conexión
            Optional<Solicitud> ida = solicitudRepository.findByEmisorIdAndReceptorId(miUsuario.getId(), u.getId());
            Optional<Solicitud> vuelta = solicitudRepository.findByEmisorIdAndReceptorId(u.getId(), miUsuario.getId());
            Solicitud sol = ida.orElse(vuelta.orElse(null));
            
            if (sol != null) {
                dto.setYaConectado("ACEPTADA".equals(sol.getEstado()));
                dto.setSolicitudPendiente("PENDIENTE".equals(sol.getEstado()));
            }
            return dto;
        }).collect(Collectors.toList());
    }
}