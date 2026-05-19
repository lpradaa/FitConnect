import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; // 🔥 IMPORTANTE: Necesario para [(ngModel)]
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // 🔥 Añadido FormsModule aquí
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router); 

  // Signals dinámicos para la interfaz
  userName = signal(localStorage.getItem('usuario_nombre') || 'Usuario');
  newProfiles = signal(0); 
  completedDays = signal(3);
  totalDays = signal(4);

  usuariosCompatibles: any[] = [];

  // 🔥 VARIABLES PARA EL MODAL DE PERFIL
  isModalOpen = false;
  emojisDisponibles = ['💪', '🏋️', '🏃', '🧘', '🚴', '🥊', '🤸', '🏊', '🏆', '🔥', '🦍', '🦄'];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Modelo de datos que enviaremos al backend
  perfilForm: any = {
    avatar: '💪',
    edad: null,
    genero: '',
    peso: null,
    nivel: '',
    objetivos: '',
    gimnasioId: 1, // Por defecto al gym 1 para probar
    horarios: []
  };

  ngOnInit(): void {
    this.cargarMatches();
  }

  cargarMatches(): void {
    this.usuarioService.getMatches().subscribe({
      next: (data) => {
        this.usuariosCompatibles = data;
        if (data && data.length > 0) {
          this.newProfiles.set(data.length); 
        }
      },
      error: (err) => console.error('Error al conectar con Spring Boot:', err)
    });
  }

  conectarConUsuario(usuarioId: number): void {
    this.usuarioService.enviarSolicitudConexion(usuarioId).subscribe({
      next: () => {
        alert('✅ Solicitud enviada');
        const usuario = this.usuariosCompatibles.find(u => u.id === usuarioId);
        if (usuario) {
          usuario.solicitudPendiente = true; 
        }
      },
      error: (err) => console.error(err)
    });
  }

  irAlChat(usuarioId: number): void {
    this.router.navigate(['/chat', usuarioId]);
  }

  // 🔥 FUNCIONES DEL MODAL DE PERFIL
  abrirModal(): void { this.isModalOpen = true; }
  cerrarModal(): void { this.isModalOpen = false; }
  seleccionarAvatar(emoji: string): void { this.perfilForm.avatar = emoji; }

  agregarHorario(): void {
    this.perfilForm.horarios.push({ diaSemana: 'Lunes', horaInicio: '10:00', horaFin: '12:00' });
  }

  eliminarHorario(index: number): void {
    this.perfilForm.horarios.splice(index, 1);
  }

  guardarPerfil(): void {
    this.usuarioService.actualizarPerfil(this.perfilForm).subscribe({
      next: (res) => {
        alert('🎉 ¡Perfil actualizado con éxito!');
        this.cerrarModal();
        this.cargarMatches(); // Recargamos para ver si hay nuevos matches con nuestro nuevo horario
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        alert('Hubo un error al guardar. Revisa la consola.');
      }
    });
  }
}