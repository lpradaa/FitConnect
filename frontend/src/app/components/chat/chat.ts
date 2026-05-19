import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 👈 Importamos el detector
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // 👈 Inyectamos el forzador de renderizado

  companeroId!: number;
  nuevoMensaje: string = '';
  historial: any[] = [];
  
  private apiUrl = 'http://localhost:8080/api/mensajes';

  ngOnInit(): void {
    this.companeroId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/historial/${this.companeroId}`, { headers }).subscribe({
      next: (data) => {
        this.historial = data;
        
        // 🚨 CHIVATO PARA LA CONSOLA 🚨
        console.log('Historial recibido del backend:', data); 
        
        // Forzamos a Angular a mostrar las burbujas al instante
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al cargar el historial del chat:', err)
    });
  }

  enviar(): void {
    if (!this.nuevoMensaje.trim()) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${this.apiUrl}/enviar/${this.companeroId}`, this.nuevoMensaje, { headers, responseType: 'text' }).subscribe({
      next: () => {
        this.nuevoMensaje = ''; 
        this.cargarHistorial(); 
      },
      error: (err) => console.error('Error al enviar el mensaje:', err)
    });
  }
}