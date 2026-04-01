package com.fitconnect.backend.services;

import com.fitconnect.backend.dtos.SolicitudDTO;
import com.fitconnect.backend.models.Solicitud;
import com.fitconnect.backend.models.Usuario;
import com.fitconnect.backend.repositories.SolicitudRepository;
import com.fitconnect.backend.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;

    public SolicitudServiceImpl(SolicitudRepository solicitudRepository, UsuarioRepository usuarioRepository) {
        this.solicitudRepository = solicitudRepository;
        this.usuarioRepository = usuarioRepository;
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

    @Override
    public SolicitudDTO enviarSolicitud(String emailEmisor, Long receptorId) {
        Usuario emisor = usuarioRepository.findByEmail(emailEmisor)
                .orElseThrow(() -> new IllegalArgumentException("Emisor no encontrado"));
        
        Usuario receptor = usuarioRepository.findById(receptorId)
                .orElseThrow(() -> new IllegalArgumentException("Receptor no encontrado"));

        // Regla 1: No puedes enviarte una solicitud a ti mismo
        if (emisor.getId().equals(receptor.getId())) {
            throw new IllegalArgumentException("No puedes enviarte una solicitud a ti mismo.");
        }

        // Regla 2: Evitar spam verificando si ya hay una solicitud previa en cualquier dirección
        Optional<Solicitud> previaIda = solicitudRepository.findByEmisorIdAndReceptorId(emisor.getId(), receptor.getId());
        Optional<Solicitud> previaVuelta = solicitudRepository.findByEmisorIdAndReceptorId(receptor.getId(), emisor.getId());
        
        if (previaIda.isPresent() || previaVuelta.isPresent()) {
            throw new IllegalArgumentException("Ya existe una solicitud entre estos usuarios.");
        }

        Solicitud nueva = new Solicitud();
        nueva.setEmisor(emisor);
        nueva.setReceptor(receptor);
        nueva.setEstado("PENDIENTE"); // Estado inicial por defecto

        Solicitud guardada = solicitudRepository.save(nueva);
        return mapearADTO(guardada);
    }

    @Override
    public SolicitudDTO responderSolicitud(String emailReceptor, Long solicitudId, String nuevoEstado) {
        Usuario usuarioLogueado = usuarioRepository.findByEmail(emailReceptor)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada"));

        // Regla 3: Solo el RECEPTOR original puede aceptar o rechazar la solicitud
        if (!solicitud.getReceptor().getId().equals(usuarioLogueado.getId())) {
            throw new SecurityException("No tienes permiso para responder a esta solicitud.");
        }

        if (!nuevoEstado.equals("ACEPTADA") && !nuevoEstado.equals("RECHAZADA")) {
            throw new IllegalArgumentException("Estado no válido.");
        }

        solicitud.setEstado(nuevoEstado);
        Solicitud actualizada = solicitudRepository.save(solicitud);
        return mapearADTO(actualizada);
    }

    @Override
    public List<SolicitudDTO> obtenerPendientes(String emailReceptor) {
        Usuario receptor = usuarioRepository.findByEmail(emailReceptor)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        List<Solicitud> pendientes = solicitudRepository.findByReceptorIdAndEstado(receptor.getId(), "PENDIENTE");
        
        return pendientes.stream().map(this::mapearADTO).collect(Collectors.toList());
    }

    // Método de utilidad para no repetir código
    private SolicitudDTO mapearADTO(Solicitud s) {
        return new SolicitudDTO(
                s.getId(),
                s.getEmisor().getId(),
                s.getEmisor().getNombre(),
                s.getReceptor().getId(),
                s.getReceptor().getNombre(),
                s.getEstado()
        );
    }
}