import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mis-conexiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-conexiones.html', // ✅ Ahora sí
  styleUrl: './mis-conexiones.scss'     // ✅ Ahora sí
})
export class MisConexionesComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // 👈 Inyectamos el forzador de renderizado

  conexiones: any[] = [];
  miId!: number;

  ngOnInit(): void {
    // Detectamos dinámicamente tu ID de usuario logueado
    this.miId = Number(localStorage.getItem('userId') || localStorage.getItem('id')); 
    this.cargarConexiones();
  }

  cargarConexiones(): void {
    this.usuarioService.obtenerMisConexiones().subscribe({
      next: (data) => {
        this.conexiones = data;
        console.log('Mis compañeros aceptados:', data);
        this.cdr.detectChanges(); // 👈 ¡Fuerza a Angular a pintar la tarjeta al instante!
      },
      error: (err) => console.error('Error al cargar conexiones:', err)
    });
  }

  abrirChat(solicitud: any): void {
    // 1. Nos aseguramos de que TODO se lea como un número matemático
    const miIdNum = Number(localStorage.getItem('id') || localStorage.getItem('userId'));
    const emisorNum = Number(solicitud.emisorId);
    const receptorNum = Number(solicitud.receptorId);

    // 2. Comparamos de forma segura
    const companeroId = (emisorNum === miIdNum) ? receptorNum : emisorNum;
    
    console.log('Mi ID es:', miIdNum);
    console.log('Intentando abrir chat con ID:', companeroId);
    
    if (companeroId) {
      this.router.navigate(['/chat', companeroId]);
    }
  }
}