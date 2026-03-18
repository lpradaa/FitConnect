package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {
    
    // Devuelve todos los horarios de un usuario concreto
    List<Disponibilidad> findByUsuarioId(Long usuarioId);

    // Devuelve quiénes entrenan un día concreto de la semana
    List<Disponibilidad> findByDiaSemanaIgnoreCase(String diaSemana);
}