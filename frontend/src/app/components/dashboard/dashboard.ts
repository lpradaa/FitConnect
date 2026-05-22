import { Component, signal, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  userName = signal(localStorage.getItem('usuario_nombre') || 'Usuario');
  newProfiles = signal(0); 
  
  // --- VARIABLES CÍRCULO DE PROGRESO ---
  completedDays = signal(0);
  totalDays = signal(4);
  progressPercentage = signal(0);

  usuariosCompatibles: any[] = [];
  solicitudesPendientes: any[] = [];

  // --- VARIABLES PARA GIMNASIOS (Restauradas) ---
  gimnasios: any[] = [];
  nuevoGimnasioNombre: string = '';
  mostrarInputGimnasio: boolean = false;

  // --- VARIABLES MODAL PERFIL ---
  isModalOpen = false;
  emojisDisponibles = ['💪', '🏋️', '🏃', '🧘', '🚴', '🥊', '🤸', '🏊', '🏆', '🔥', '🦍', '🦄'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  perfilForm: any = {
    avatar: '💪', edad: null, genero: '', peso: null, nivel: 'Intermedio', objetivos: '', gimnasioId: null, nuevoGimnasioNombre: '', horarios: [], metaSemanal: 4
  };

  // --- VARIABLES MODAL ENTRENAMIENTO ---
  isEntrenamientoModalOpen = false;
  historialEntrenamientos: any[] = []; 
  nuevoEntrenamiento: any = { fecha: '', tipo: '', duracionMinutos: null, lugarONotas: '' };

  // --- VARIABLES MODAL "EFECTO WOW" TOP MATCH ---
  isTopMatchModalOpen = false;
  isCalculatingMatch = false;
  topMatchUser: any = null;
  disponiblesList: any[] = [];
  currentMatchIndex: number = 0;

  // 🔥 VARIABLES PARA EL TOAST NOTIFICATION
  toast: { show: boolean, message: string, type: 'success' | 'error' } = { show: false, message: '', type: 'success' };
  private toastTimeout: any;

  ngOnInit(): void {
    this.cargarMatches();
    this.cargarHistorialEntrenamientos();
    this.cargarSolicitudesPendientes();
    this.cargarGimnasios(); // Aseguramos que cargan los gimnasios
    
    this.usuarioService.getMiPerfil().subscribe({
      next: (data) => {
        if (data) {
          if (data.nombre) this.userName.set(data.nombre);
          const metaGuardada = localStorage.getItem('meta_semanal_' + this.userName());
          const meta = metaGuardada ? parseInt(metaGuardada, 10) : 4;

          this.perfilForm = {
            avatar: data.avatar || '💪', edad: data.edad, genero: data.genero, peso: data.peso,
            nivel: data.nivel || 'Intermedio', objetivos: data.objetivos, gimnasioId: data.gimnasioId,
            horarios: data.horarios || [], metaSemanal: meta
          };
          this.calcularProgresoSemanal();
        }
      },
      error: (err) => console.error('Error al cargar mi perfil:', err)
    });
  }

  // --- GIMNASIOS ---
  cargarGimnasios() {
    this.usuarioService.getGimnasios().subscribe((data: any) => this.gimnasios = data);
  }

  toggleNuevoGimnasio(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.mostrarInputGimnasio = (selectElement.value === 'NUEVO');
    if (!this.mostrarInputGimnasio) this.nuevoGimnasioNombre = '';
    this.cdr.detectChanges();
  }

  // 🔥 FUNCIÓN PARA MOSTRAR EL TOAST (Reemplaza a los alert)
  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.toast = { show: true, message: mensaje, type: tipo };
    if (this.cdr) this.cdr.detectChanges();

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    
    this.toastTimeout = setTimeout(() => {
      this.toast.show = false;
      if (this.cdr) this.cdr.detectChanges();
    }, 3000); 
  }

  // 🔥 LÓGICA DEL ALGORITMO Y CARRUSEL
  buscarTopMatch(): void {
    this.isTopMatchModalOpen = true;
    this.isCalculatingMatch = true;
    this.cargarMatches(); 

    setTimeout(() => {
      try {
        const miIdString = localStorage.getItem('userId') || localStorage.getItem('id');
        const miId = Number(miIdString);

        const disponibles = this.usuariosCompatibles.filter(u => {
          if (!u) return false;
          return u.id !== miId && !u.solicitudPendiente && !u.yaConectado;
        });

        this.disponiblesList = disponibles;
        this.currentMatchIndex = 0;
        this.topMatchUser = this.disponiblesList.length > 0 ? this.disponiblesList[0] : null;

      } catch (error) {
        console.error('Error al calcular el match:', error);
        this.topMatchUser = null; 
      } finally {
        this.isCalculatingMatch = false; 
        this.cdr.detectChanges(); 
      }
    }, 1500); 
  }

  siguienteMatch(): void {
    if (this.currentMatchIndex < this.disponiblesList.length - 1) {
      this.currentMatchIndex++;
      this.topMatchUser = this.disponiblesList[this.currentMatchIndex];
      this.cdr.detectChanges();
    }
  }

  anteriorMatch(): void {
    if (this.currentMatchIndex > 0) {
      this.currentMatchIndex--;
      this.topMatchUser = this.disponiblesList[this.currentMatchIndex];
      this.cdr.detectChanges();
    }
  }

  cerrarTopMatchModal(): void {
    this.isTopMatchModalOpen = false;
    this.topMatchUser = null;
    this.cdr.detectChanges();
  }

  conectarConTopMatch(): void {
    if (this.topMatchUser) {
      this.conectarConUsuario(this.topMatchUser.id);
      this.cerrarTopMatchModal();
    }
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

    const entrenosEstaSemana = this.historialEntrenamientos.filter(ent => new Date(ent.fecha) >= lunes);
    
    // 🔥 CORRECCIÓN: Contamos el total de entrenamientos (length), ya no filtramos por "días únicos"
    const totalEntrenos = entrenosEstaSemana.length;
    
    this.completedDays.set(totalEntrenos);
    let porcentaje = (totalEntrenos / meta) * 100;
    this.progressPercentage.set(porcentaje > 100 ? 100 : porcentaje);
  }

  actualizarMetaDesdeSlider(event: Event): void {
    const nuevoValor = parseInt((event.target as HTMLInputElement).value, 10);
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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al conectar con Spring Boot:', err)
    });
  }

  conectarConUsuario(usuarioId: number): void {
    this.usuarioService.enviarSolicitudConexion(usuarioId).subscribe({
      next: () => { 
        this.mostrarToast('¡Solicitud enviada correctamente!', 'success'); 
        const usuario = this.usuariosCompatibles.find(u => u.id === usuarioId); 
        if (usuario) { usuario.solicitudPendiente = true; } 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Error al enviar la solicitud', 'error');
      }
    });
  }

  cargarSolicitudesPendientes(): void {
    this.usuarioService.obtenerSolicitudesPendientes().subscribe({
      next: (data) => {
        this.solicitudesPendientes = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar la bandeja de solicitudes:', err)
    });
  }

  responderSolicitud(solicitudId: number, estado: 'ACEPTADA' | 'RECHAZADA'): void {
    this.usuarioService.responderSolicitud(solicitudId, estado).subscribe({
      next: () => {
        if (estado === 'ACEPTADA') this.mostrarToast('¡Nuevo compañero añadido! Ya podéis chatear.', 'success');
        if (estado === 'RECHAZADA') this.mostrarToast('Solicitud rechazada.', 'success');
        this.cargarSolicitudesPendientes();
        this.cargarMatches();
      },
      error: (err) => this.mostrarToast('Hubo un error al procesar la solicitud.', 'error')
    });
  }

  irAlChat(usuarioId: number): void { this.router.navigate(['/chat', usuarioId]); }

  // --- FUNCIONES MODAL PERFIL Y ENTRENAMIENTO ---
  abrirModal(): void { this.isModalOpen = true; this.cdr.detectChanges(); }
  cerrarModal(): void { this.isModalOpen = false; this.cdr.detectChanges(); }
  seleccionarAvatar(emoji: string): void { this.perfilForm.avatar = emoji; }
  agregarHorario(): void { this.perfilForm.horarios.push({ diaSemana: 'Lunes', horaInicio: '10:00', horaFin: '12:00' }); }
  eliminarHorario(index: number): void { this.perfilForm.horarios.splice(index, 1); }
  
  guardarPerfil(): void {
    localStorage.setItem('meta_semanal_' + this.userName(), this.perfilForm.metaSemanal.toString());
    
    // Restaurado: Enviar nuevo gimnasio si el usuario lo creó
    if (this.mostrarInputGimnasio) {
      this.perfilForm.nuevoGimnasioNombre = this.nuevoGimnasioNombre;
      this.perfilForm.gimnasioId = null;
    }

    this.usuarioService.actualizarPerfil(this.perfilForm).subscribe({
      next: () => { 
        this.mostrarToast('¡Perfil actualizado con éxito!', 'success'); 
        this.cerrarModal(); 
        this.ngOnInit(); 
      },
      error: (err) => this.mostrarToast('Hubo un error al guardar tu perfil.', 'error')
    });
  }

  cargarHistorialEntrenamientos(): void {
    this.usuarioService.getMisEntrenamientos().subscribe({
      next: (data) => { this.historialEntrenamientos = data; this.calcularProgresoSemanal(); this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando entrenamientos:', err)
    });
  }

  abrirModalEntrenamiento(): void {
    this.nuevoEntrenamiento = { fecha: new Date().toISOString().split('T')[0], tipo: 'Fuerza (Torso)', duracionMinutos: null, lugarONotas: '' };
    this.isEntrenamientoModalOpen = true;
    this.cdr.detectChanges();
  }
  
  cerrarModalEntrenamiento(): void { this.isEntrenamientoModalOpen = false; this.cdr.detectChanges(); }
  
  guardarEntrenamiento(): void {
    this.usuarioService.registrarEntrenamiento(this.nuevoEntrenamiento).subscribe({
      next: () => { 
        this.mostrarToast('¡Entrenamiento registrado correctamente!', 'success'); 
        this.cargarHistorialEntrenamientos(); 
        this.cerrarModalEntrenamiento(); 
      },
      error: (err) => this.mostrarToast('Hubo un error al guardar tu entrenamiento.', 'error')
    });
  }
}