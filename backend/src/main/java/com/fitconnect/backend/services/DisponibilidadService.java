package com.fitconnect.backend.services;

import com.fitconnect.backend.dtos.DisponibilidadDTO;
import java.util.List;

public interface DisponibilidadService {
    DisponibilidadDTO agregarHorario(String emailUsuario, DisponibilidadDTO dto);
    List<DisponibilidadDTO> obtenerHorariosDeUsuario(String emailUsuario);
    void eliminarHorario(String emailUsuario, Long idHorario);
}