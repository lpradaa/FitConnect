package com.fitconnect.backend.services;

import com.fitconnect.backend.models.Gimnasio;
import com.fitconnect.backend.repositories.GimnasioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GimnasioServiceImpl implements GimnasioService {

    private final GimnasioRepository gimnasioRepository;

   
    public GimnasioServiceImpl(GimnasioRepository gimnasioRepository) {
        this.gimnasioRepository = gimnasioRepository;
    }

    @Override
    public List<Gimnasio> obtenerTodos() { return gimnasioRepository.findAll(); }

    @Override
    public List<Gimnasio> buscarPorCiudad(String ciudad) { return gimnasioRepository.findByCiudadIgnoreCase(ciudad); }

    @Override
    public Gimnasio guardar(Gimnasio gimnasio) { return gimnasioRepository.save(gimnasio); }
}
