package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Entrenamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntrenamientoRepository extends JpaRepository<Entrenamiento, Long> {
    // Busca los entrenamientos de un usuario y los ordena del más reciente al más antiguo
    List<Entrenamiento> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
}