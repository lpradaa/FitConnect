import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 👈 1. Importamos el Router para poder viajar de pantalla
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router); // 👈 2. Inyectamos el enrutador

  // 🔄 Signals dinámicos para la interfaz
  userName = signal(localStorage.getItem('usuario_nombre') || 'Usuario');
  newProfiles = signal(0); 
  completedDays = signal(3);
  totalDays = signal(4);

  // Array que almacena los compañeros pintados en las tarjetas
  usuariosCompatibles: any[] = [];

  ngOnInit(): void {
    // Al cargar la pantalla, pedimos los matches al backend
    this.usuarioService.getMatches().subscribe({
      next: (data) => {
        this.usuariosCompatibles = data;
        if (data && data.length > 0) {
          this.newProfiles.set(data.length); // Actualiza el número en el banner
        }
        console.log('Backend conectado con éxito. Matches:', data);
      },
      error: (err) => {
        console.error('Error al conectar con Spring Boot:', err);
      }
    });
  }

  // 🔥 Función conectada al botón "Enviar Solicitud"
  conectarConUsuario(usuarioId: number): void {
    console.log(`Enviando solicitud de conexión al usuario ID: ${usuarioId}...`);

    this.usuarioService.enviarSolicitudConexion(usuarioId).subscribe({
      next: (respuesta) => {
        console.log('¡Éxito!', respuesta);
        alert('✅ ¡Solicitud enviada correctamente! Esperando a que el usuario acepte.');
        
        // Efecto visual: Quitamos a ese usuario de la lista visualmente para no repetir solicitud
        this.usuariosCompatibles = this.usuariosCompatibles.filter(u => u.id !== usuarioId);
        
        // Actualizamos el contador del banner
        this.newProfiles.set(this.usuariosCompatibles.length);
      },
      error: (err) => {
        console.error('Error del backend:', err);
        alert('❌ No se pudo enviar: ' + (err.error || 'Error desconocido'));
      }
    });
  }

  // 👈 3. Función conectada al nuevo botón "Chatear"
  irAlChat(usuarioId: number): void {
    this.router.navigate(['/chat', usuarioId]);
  }
}