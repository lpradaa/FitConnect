package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Solicitud;
import com.fitconnect.backend.repositories.SolicitudRepository;
import org.springframework.stereotype.Service;

@Service
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;

    public SolicitudServiceImpl(SolicitudRepository solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }

    @Override
    public Solicitud crearSolicitud(Solicitud solicitud) {
        solicitud.setEstado("PENDIENTE");
        return solicitudRepository.save(solicitud);
    }

    @Override
    public Solicitud cambiarEstado(Long id, String nuevoEstado) {
        Solicitud solicitud = solicitudRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));
        
        solicitud.setEstado(nuevoEstado);
        return solicitudRepository.save(solicitud);
    }
}