package com.fitconnect.backend.services;
import com.fitconnect.backend.models.Mensaje;
import com.fitconnect.backend.repositories.MensajeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeServiceImpl implements MensajeService {

    private final MensajeRepository mensajeRepository;

    public MensajeServiceImpl(MensajeRepository mensajeRepository) {
        this.mensajeRepository = mensajeRepository;
    }

    @Override
    public Mensaje enviarMensaje(Mensaje mensaje) {
        // La fecha de envío ya se pone sola en el constructor de la entidad
        return mensajeRepository.save(mensaje);
    }

    @Override
    public List<Mensaje> obtenerMensajesRecibidos(Long receptorId) {
        return mensajeRepository.findByReceptorIdOrderByFechaEnvioDesc(receptorId);
    }
}