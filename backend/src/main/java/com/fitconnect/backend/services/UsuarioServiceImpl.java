package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Usuario;
import com.fitconnect.backend.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service 
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario registrarUsuario(Usuario nuevoUsuario) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(nuevoUsuario.getEmail());
        if (usuarioExistente.isPresent()) {
            throw new IllegalArgumentException("Error: El email ya está registrado en FitConnect.");
        }
        return usuarioRepository.save(nuevoUsuario);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }
}