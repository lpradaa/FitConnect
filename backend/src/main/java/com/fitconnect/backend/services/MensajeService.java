package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Mensaje;
import java.util.List;

public interface MensajeService {
    Mensaje enviarMensaje(Mensaje mensaje);
    List<Mensaje> obtenerMensajesRecibidos(Long receptorId);
}