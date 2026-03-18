package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Disponibilidad;
import java.util.List;

public interface DisponibilidadService {
    Disponibilidad agregarHorario(Disponibilidad disponibilidad);
    List<Disponibilidad> obtenerHorariosDeUsuario(Long usuarioId);
}