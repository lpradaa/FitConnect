import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // 👈 Esto es VITAL para que el HTML entienda las directivas
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private usuarioService = inject(UsuarioService);

  // Variables originales de tu compañero (Signals)
  userName = signal('Luis');
  newProfiles = signal(3); 
  completedDays = signal(3);
  totalDays = signal(4);

  // Array nativo clásico (evitamos líos de tipado con signals en el renderizado por ahora)
  usuariosCompatibles: any[] = [];

  ngOnInit(): void {
    this.usuarioService.getMatches().subscribe({
      next: (data) => {
        this.usuariosCompatibles = data;
        if (data && data.length > 0) {
          this.newProfiles.set(data.length);
        }
        console.log('Backend conectado con éxito:', data);
      },
      error: (err) => {
        console.error('Error al morder Spring Boot:', err);
      }
    });
  }
}