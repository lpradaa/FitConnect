package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    
    // Para ver todas las peticiones globales que están "PENDIENTES"
    List<Solicitud> findByEstado(String estado);
    
}