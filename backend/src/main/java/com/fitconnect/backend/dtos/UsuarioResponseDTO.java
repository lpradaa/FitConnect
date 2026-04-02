package com.fitconnect.backend.dtos;

public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private Integer edad;
    private String genero;
    private Float peso;
    private String nivel;
    private String objetivos;

    // 2. CONSTRUCTOR ORIGINAL (Para cuando se registran y aún no tienen perfil completo)
    public UsuarioResponseDTO(Long id, String nombre, String email, Integer edad, String genero, Float peso) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.edad = edad;
        this.genero = genero;
        this.peso = peso;
    }

    // 3. CONSTRUCTOR NUEVO (Para devolver el perfil completo)
    public UsuarioResponseDTO(Long id, String nombre, String email, Integer edad, String genero, Float peso, String nivel, String objetivos) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.edad = edad;
        this.genero = genero;
        this.peso = peso;
        this.nivel = nivel;
        this.objetivos = objetivos;
    }

    // Getters y Setters originales...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public Float getPeso() { return peso; }
    public void setPeso(Float peso) { this.peso = peso; }
    
    // 4. GETTERS Y SETTERS NUEVOS
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
    public String getObjetivos() { return objetivos; }
    public void setObjetivos(String objetivos) { this.objetivos = objetivos; }

   
}
