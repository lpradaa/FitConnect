package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    Usuario registrarUsuario(Usuario nuevoUsuario);
    Optional<Usuario> buscarPorEmail(String email);
    List<Usuario> obtenerTodosLosUsuarios();
}