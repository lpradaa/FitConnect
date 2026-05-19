import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes.html', // 👈 Ajustado a tu nombre de archivo
  styleUrl: './solicitudes.scss'     // 👈 Ajustado a tu nuevo archivo scss
})
export class SolicitudesComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  solicitudesPendientes: any[] = [];

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.usuarioService.obtenerSolicitudesPendientes().subscribe({
      next: (data) => {
        this.solicitudesPendientes = data;
        console.log('Solicitudes recibidas:', data);
      },
      error: (err) => console.error('Error al cargar solicitudes:', err)
    });
  }

  responder(solicitudId: number, estado: 'ACEPTADA' | 'RECHAZADA'): void {
    this.usuarioService.responderSolicitud(solicitudId, estado).subscribe({
      next: (res) => {
        const accion = estado === 'ACEPTADA' ? '✅ aceptado' : '❌ rechazado';
        alert(`Has ${accion} la solicitud correctamente.`);
        
        // Filtramos la lista para que la tarjeta desaparezca visualmente al instante
        this.solicitudesPendientes = this.solicitudesPendientes.filter(s => s.id !== solicitudId);
      },
      error: (err) => {
        console.error('Error al responder:', err);
        alert('Hubo un error al procesar tu respuesta.');
      }
    });
  }
}