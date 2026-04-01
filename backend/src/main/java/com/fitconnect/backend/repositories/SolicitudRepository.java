package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    
    // Busca si ya existe una solicitud previa entre dos usuarios (para evitar duplicados/spam)
    Optional<Solicitud> findByEmisorIdAndReceptorId(Long emisorId, Long receptorId);

    // Busca todas las solicitudes que ha recibido un usuario y que están en un estado concreto (ej: "PENDIENTE")
    List<Solicitud> findByReceptorIdAndEstado(Long receptorId, String estado);
    
    // Busca todas las solicitudes aceptadas de un usuario (para saber quiénes son sus "Matches")
    List<Solicitud> findByEmisorIdAndEstadoOrReceptorIdAndEstado(Long emisorId, String estado1, Long receptorId, String estado2);
}