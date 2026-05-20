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
  
  // --- VARIABLES CÍRCULO DE PROGRESO ---
  completedDays = signal(0);
  totalDays = signal(4);
  progressPercentage = signal(0);

  usuariosCompatibles: any[] = [];
  
  // 🔥 NUEVA VARIABLE: Bandeja de entrada de solicitudes
  solicitudesPendientes: any[] = [];

  // --- VARIABLES MODAL PERFIL ---
  isModalOpen = false;
  emojisDisponibles = ['💪', '🏋️', '🏃', '🧘', '🚴', '🥊', '🤸', '🏊', '🏆', '🔥', '🦍', '🦄'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  perfilForm: any = {
    avatar: '💪', edad: null, genero: '', peso: null, nivel: 'Intermedio', objetivos: '', gimnasioId: null, horarios: [], metaSemanal: 4
  };

  // --- VARIABLES MODAL ENTRENAMIENTO ---
  isEntrenamientoModalOpen = false;
  historialEntrenamientos: any[] = []; 
  nuevoEntrenamiento: any = { fecha: '', tipo: '', duracionMinutos: null, lugarONotas: '' };

  ngOnInit(): void {
    // 1. Cargamos las vistas principales
    this.cargarMatches();
    this.cargarHistorialEntrenamientos();
    
    // 🔥 2. Cargamos las solicitudes que nos hayan enviado
    this.cargarSolicitudesPendientes();
    
    // 3. Cargamos los datos reales del perfil
    this.usuarioService.getMiPerfil().subscribe({
      next: (data) => {
        if (data) {
          if (data.nombre) this.userName.set(data.nombre);
          
          const metaGuardada = localStorage.getItem('meta_semanal_' + this.userName());
          const meta = metaGuardada ? parseInt(metaGuardada, 10) : 4;

          this.perfilForm = {
            avatar: data.avatar || '💪',
            edad: data.edad,
            genero: data.genero,
            peso: data.peso,
            nivel: data.nivel || 'Intermedio',
            objetivos: data.objetivos,
            gimnasioId: data.gimnasioId,
            horarios: data.horarios || [],
            metaSemanal: meta
          };
          this.calcularProgresoSemanal();
        }
      },
      error: (err) => console.error('Error al cargar mi perfil:', err)
    });
  }

  // --- LÓGICA DE PROGRESO SEMANAL ---
  calcularProgresoSemanal(): void {
    const metaGuardada = localStorage.getItem('meta_semanal_' + this.userName());
    const meta = metaGuardada ? parseInt(metaGuardada, 10) : (this.perfilForm.metaSemanal || 4);
    this.perfilForm.metaSemanal = meta; 
    this.totalDays.set(meta);

    const hoy = new Date();
    const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay(); 
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diaSemana + 1);
    lunes.setHours(0, 0, 0, 0);

    const entrenosEstaSemana = this.historialEntrenamientos.filter(ent => {
      const fechaEntreno = new Date(ent.fecha);
      return fechaEntreno >= lunes;
    });

    const diasUnicos = new Set(entrenosEstaSemana.map(ent => ent.fecha)).size;
    this.completedDays.set(diasUnicos);

    let porcentaje = (diasUnicos / meta) * 100;
    if (porcentaje > 100) porcentaje = 100;
    
    this.progressPercentage.set(porcentaje);
  }

  actualizarMetaDesdeSlider(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const nuevoValor = parseInt(inputElement.value, 10);
    this.perfilForm.metaSemanal = nuevoValor;
    localStorage.setItem('meta_semanal_' + this.userName(), nuevoValor.toString());
    this.calcularProgresoSemanal();
  }

  // --- FUNCIONES DE SOLICITUDES Y MATCHES ---
  cargarMatches(): void {
    this.usuarioService.getMatches().subscribe({
      next: (data) => {
        this.usuariosCompatibles = data || [];
        this.newProfiles.set(this.usuariosCompatibles.length); 
      },
      error: (err) => console.error('Error al conectar con Spring Boot:', err)
    });
  }

  conectarConUsuario(usuarioId: number): void {
    this.usuarioService.enviarSolicitudConexion(usuarioId).subscribe({
      next: () => { 
        alert('✅ Solicitud enviada correctamente.'); 
        const usuario = this.usuariosCompatibles.find(u => u.id === usuarioId); 
        if (usuario) { usuario.solicitudPendiente = true; } 
      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 NUEVO: Cargar las solicitudes en la bandeja
  cargarSolicitudesPendientes(): void {
    this.usuarioService.obtenerSolicitudesPendientes().subscribe({
      next: (data) => this.solicitudesPendientes = data || [],
      error: (err) => console.error('Error al cargar la bandeja de solicitudes:', err)
    });
  }

  // 🔥 NUEVO: Aceptar o Rechazar a un compañero
  responderSolicitud(solicitudId: number, estado: 'ACEPTADA' | 'RECHAZADA'): void {
    this.usuarioService.responderSolicitud(solicitudId, estado).subscribe({
      next: () => {
        if (estado === 'ACEPTADA') {
          alert('🎉 ¡Nuevo compañero añadido! Ya podéis chatear.');
        }
        // Refrescamos las listas para que desaparezca la notificación
        this.cargarSolicitudesPendientes();
        this.cargarMatches();
      },
      error: (err) => {
        console.error('Error al responder:', err);
        alert('Hubo un error al procesar la solicitud.');
      }
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
    localStorage.setItem('meta_semanal_' + this.userName(), this.perfilForm.metaSemanal.toString());

    this.usuarioService.actualizarPerfil(this.perfilForm).subscribe({
      next: (res) => { 
        alert('🎉 ¡Perfil actualizado con éxito!'); 
        this.cerrarModal(); 
        this.ngOnInit(); 
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
      next: (data) => {
        this.historialEntrenamientos = data;
        this.calcularProgresoSemanal();
      },
      error: (err) => console.error('Error cargando entrenamientos:', err)
    });
  }

  abrirModalEntrenamiento(): void {
    this.nuevoEntrenamiento = { 
      fecha: new Date().toISOString().split('T')[0], 
      tipo: '', 
      duracionMinutos: 60, 
      lugarONotas: '' 
    };
    this.isEntrenamientoModalOpen = true;
  }
  
  cerrarModalEntrenamiento(): void { this.isEntrenamientoModalOpen = false; }
  
  guardarEntrenamiento(): void {
    this.usuarioService.registrarEntrenamiento(this.nuevoEntrenamiento).subscribe({
      next: (res) => {
        alert('🏋️‍♂️ ¡Entrenamiento registrado en la Base de Datos!');
        this.cargarHistorialEntrenamientos(); 
        this.cerrarModalEntrenamiento();
      },
      error: (err) => {
        console.error('Error al guardar entrenamiento:', err);
        alert('Hubo un error al guardar tu entrenamiento.');
      }
    });
  }
}