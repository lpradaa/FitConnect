package com.fitconnect.backend.dtos;

public class UsuarioPerfilDTO {
    private Integer edad;
    private String genero;
    private Float peso;
    private String nivel; // Ej: Principiante, Intermedio, Avanzado
    private String objetivos; // Ej: Hipertrofia, Resistencia, Pérdida de peso
    private Long gimnasioId; // El ID del gimnasio que ha elegido del desplegable

    // Getters y Setters
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public Float getPeso() { return peso; }
    public void setPeso(Float peso) { this.peso = peso; }
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
    public String getObjetivos() { return objetivos; }
    public void setObjetivos(String objetivos) { this.objetivos = objetivos; }
    public Long getGimnasioId() { return gimnasioId; }
    public void setGimnasioId(Long gimnasioId) { this.gimnasioId = gimnasioId; }
}