package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Añadir mas metodos en un futuro si es necesario. -> Spring genera automaticamente los metodos basicos como findById, findAll, save, deleteById, etc.
    Optional<Usuario> findByEmail(String email);
    
}