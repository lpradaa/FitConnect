package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Disponibilidad;
import com.fitconnect.backend.repositories.DisponibilidadRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DisponibilidadServiceImpl implements DisponibilidadService {

    private final DisponibilidadRepository disponibilidadRepository;

    public DisponibilidadServiceImpl(DisponibilidadRepository disponibilidadRepository) {
        this.disponibilidadRepository = disponibilidadRepository;
    }

    @Override
    public Disponibilidad agregarHorario(Disponibilidad disponibilidad) {
        return disponibilidadRepository.save(disponibilidad);
    }

    @Override
    public List<Disponibilidad> obtenerHorariosDeUsuario(Long usuarioId) {
        return disponibilidadRepository.findByUsuarioId(usuarioId);
    }
}