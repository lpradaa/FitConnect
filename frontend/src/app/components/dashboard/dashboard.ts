import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router); 

  userName = signal(localStorage.getItem('usuario_nombre') || 'Usuario');
  newProfiles = signal(0); 
  completedDays = signal(3);
  totalDays = signal(4);

  usuariosCompatibles: any[] = [];

  // --- VARIABLES MODAL PERFIL ---
  isModalOpen = false;
  emojisDisponibles = ['💪', '🏋️', '🏃', '🧘', '🚴', '🥊', '🤸', '🏊', '🏆', '🔥', '🦍', '🦄'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  perfilForm: any = {
    avatar: '💪', edad: null, genero: '', peso: null, nivel: 'Intermedio', objetivos: '', gimnasioId: null, horarios: []
  };

  // --- VARIABLES MODAL ENTRENAMIENTO ---
  isEntrenamientoModalOpen = false;
  historialEntrenamientos: any[] = []; // Se llena automáticamente desde la base de datos
  nuevoEntrenamiento: any = { fecha: '', tipo: '', duracionMinutos: null, lugarONotas: '' };

  ngOnInit(): void {
    // 1. Cargamos los perfiles compatibles
    this.cargarMatches();

    // 2. Cargamos el historial de entrenamientos desde la BD
    this.cargarHistorialEntrenamientos();
    
    // 3. Cargamos TUS datos reales de la BD para el panel lateral
    this.usuarioService.getMiPerfil().subscribe({
      next: (data) => {
        if (data) {
          if (data.nombre) this.userName.set(data.nombre);
          
          this.perfilForm = {
            avatar: data.avatar || '💪', // Brazo por defecto si no hay avatar
            edad: data.edad,
            genero: data.genero,
            peso: data.peso,
            nivel: data.nivel || 'Intermedio',
            objetivos: data.objetivos,
            gimnasioId: data.gimnasioId,
            horarios: [] // Más adelante cargaremos los horarios reales desde BD
          };
        }
      },
      error: (err) => console.error('Error al cargar mi perfil:', err)
    });
  }

  // --- FUNCIONES DE MATCHES ---
  cargarMatches(): void {
    this.usuarioService.getMatches().subscribe({
      next: (data) => {
        this.usuariosCompatibles = data || [];
        // Actualizamos el número correctamente (incluso si es 0, para que no se quede congelado)
        this.newProfiles.set(this.usuariosCompatibles.length); 
      },
      error: (err) => console.error('Error al conectar con Spring Boot:', err)
    });
  }

  conectarConUsuario(usuarioId: number): void {
    this.usuarioService.enviarSolicitudConexion(usuarioId).subscribe({
      next: () => { 
        alert('✅ Solicitud enviada'); 
        const usuario = this.usuariosCompatibles.find(u => u.id === usuarioId); 
        if (usuario) { usuario.solicitudPendiente = true; } 
      },
      error: (err) => console.error(err)
    });
  }

  irAlChat(usuarioId: number): void { 
    this.router.navigate(['/chat', usuarioId]); 
  }

  // --- FUNCIONES MODAL PERFIL ---
  abrirModal(): void { this.isModalOpen = true; }
  cerrarModal(): void { this.isModalOpen = false; }
  seleccionarAvatar(emoji: string): void { this.perfilForm.avatar = emoji; }
  agregarHorario(): void { this.perfilForm.horarios.push({ diaSemana: 'Lunes', horaInicio: '10:00', horaFin: '12:00' }); }
  eliminarHorario(index: number): void { this.perfilForm.horarios.splice(index, 1); }
  
  guardarPerfil(): void {
    this.usuarioService.actualizarPerfil(this.perfilForm).subscribe({
      next: (res) => { 
        alert('🎉 ¡Perfil actualizado con éxito!'); 
        this.cerrarModal(); 
        this.ngOnInit(); // Refrescamos todo tras guardar
      },
      error: (err) => { 
        console.error('Error actualizando perfil:', err); 
        alert('Hubo un error al guardar. Revisa la consola.'); 
      }
    });
  }

  // --- FUNCIONES MODAL ENTRENAMIENTOS ---
  cargarHistorialEntrenamientos(): void {
    this.usuarioService.getMisEntrenamientos().subscribe({
      next: (data) => this.historialEntrenamientos = data,
      error: (err) => console.error('Error cargando entrenamientos:', err)
    });
  }

  abrirModalEntrenamiento(): void {
    // Pre-llenamos la fecha con el día de hoy por comodidad
    this.nuevoEntrenamiento = { 
      fecha: new Date().toISOString().split('T')[0], 
      tipo: '', 
      duracionMinutos: 60, 
      lugarONotas: '' 
    };
    this.isEntrenamientoModalOpen = true;
  }
  
  cerrarModalEntrenamiento(): void { 
    this.isEntrenamientoModalOpen = false; 
  }
  
  guardarEntrenamiento(): void {
    this.usuarioService.registrarEntrenamiento(this.nuevoEntrenamiento).subscribe({
      next: (res) => {
        alert('🏋️‍♂️ ¡Entrenamiento registrado en la Base de Datos!');
        this.cargarHistorialEntrenamientos(); // Recargamos la lista tras guardar para verlo al instante
        this.cerrarModalEntrenamiento();
      },
      error: (err) => {
        console.error('Error al guardar entrenamiento:', err);
        alert('Hubo un error al guardar tu entrenamiento.');
      }
    });
  }
}