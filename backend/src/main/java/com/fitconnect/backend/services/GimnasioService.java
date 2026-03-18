package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Gimnasio;
import java.util.List;

public interface GimnasioService {
    List<Gimnasio> obtenerTodos();
    List<Gimnasio> buscarPorCiudad(String ciudad);
    Gimnasio guardar(Gimnasio gimnasio);
}