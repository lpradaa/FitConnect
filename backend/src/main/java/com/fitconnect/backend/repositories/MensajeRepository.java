package com.fitconnect.backend.repositories;

import com.fitconnect.backend.models.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    
    // Devuelve los mensajes donde el usuario es el receptor, ordenados por fecha
    List<Mensaje> findByReceptorIdOrderByFechaEnvioDesc(Long receptorId);
    
    // Devuelve los mensajes que un usuario ha enviado
    List<Mensaje> findByEmisorIdOrderByFechaEnvioDesc(Long emisorId);
}