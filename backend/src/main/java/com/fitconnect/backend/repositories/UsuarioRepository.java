package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);

    // 🔥 SOLUCIÓN DEFINITIVA EN JPQL (Carga los objetos anidados como Gimnasio correctamente)
    @Query("SELECT DISTINCT u FROM Usuario u " +
           "JOIN u.disponibilidades d1 " +
           "JOIN Disponibilidad d2 ON d1.diaSemana = d2.diaSemana " +
           "WHERE u.gimnasio.id = :gimId " +
           "AND u.id != :miId " +
           "AND u.nivel = :miNivel " +
           "AND d2.usuario.id = :miId " +
           "AND cast(d1.horaInicio as time) < cast(d2.horaFin as time) " +
           "AND cast(d1.horaFin as time) > cast(d2.horaInicio as time)")
    List<Usuario> buscarMatches(@Param("gimId") Long gimId, 
                                @Param("miId") Long miId, 
                                @Param("miNivel") String miNivel);
    
}