package com.fitconnect.backend.services;

import com.fitconnect.backend.dtos.UsuarioPerfilDTO;
import com.fitconnect.backend.dtos.UsuarioRegistroDTO;
import com.fitconnect.backend.dtos.UsuarioResponseDTO;
import com.fitconnect.backend.models.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {

   // Ahora usamos DTOs para el registro
    UsuarioResponseDTO registrarUsuario(UsuarioRegistroDTO dto);
    Optional<Usuario> buscarPorEmail(String email);
    List<Usuario> obtenerTodosLosUsuarios();
    UsuarioResponseDTO actualizarPerfil(String email, UsuarioPerfilDTO dto);
    List<UsuarioResponseDTO> buscarCompañeros(String email);
}