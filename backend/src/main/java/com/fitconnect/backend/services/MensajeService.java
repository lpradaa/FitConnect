package com.fitconnect.backend.services;

import com.fitconnect.backend.dtos.MensajeDTO;
import java.util.List;

public interface MensajeService {
    MensajeDTO enviarMensaje(String emailEmisor, Long receptorId, String contenido);
    List<MensajeDTO> obtenerHistorial(String emailUsuario, Long otroUsuarioId);
}