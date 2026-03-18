package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Solicitud;

public interface SolicitudService {
    Solicitud crearSolicitud(Solicitud solicitud);
    Solicitud cambiarEstado(Long id, String nuevoEstado);
}