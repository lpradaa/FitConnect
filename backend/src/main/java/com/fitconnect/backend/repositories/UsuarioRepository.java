package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Añadir mas metodos en un futuro si es necesario. -> Spring genera automaticamente los metodos basicos como findById, findAll, save, deleteById, etc.
    Optional<Usuario> findByEmail(String email);

    @Query("SELECT DISTINCT u FROM Usuario u " +
           "JOIN u.disponibilidades d1 " +
           "JOIN Disponibilidad d2 ON d1.diaSemana = d2.diaSemana " +
           "WHERE u.gimnasio.id = :gimId " +
           "AND u.id != :miId " +
           "AND u.nivel = :miNivel " +
           "AND d2.usuario.id = :miId " +
           "AND d1.horaInicio < d2.horaFin " +
           "AND d1.horaFin > d2.horaInicio")
    List<Usuario> buscarMatches(@Param("gimId") Long gimId, 
                                @Param("miId") Long miId, 
                                @Param("miNivel") String miNivel);
    
}