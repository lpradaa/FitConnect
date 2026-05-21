import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-mis-conexiones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-conexiones.html',
  styleUrl: './mis-conexiones.scss'
})
export class MisConexionesComponent implements OnInit, AfterViewChecked {
  private usuarioService = inject(UsuarioService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  // --- ESTADO DE LA LISTA ---
  conexiones: any[] = [];
  miId!: number;
  busqueda: string = ''; 

  // --- ESTADO DEL CHAT ---
  chatActivo: { id: number, nombre: string, avatar: string } | null = null;
  historial: any[] = [];
  nuevoMensaje: string = '';
  mostrarEmojis: boolean = false;
  emojisRapidos = ['😂', '😍', '💪', '🔥', '🏋️‍♂️', '🏃‍♀️', '👏', '💯', '🙏', '👀'];
  private apiUrl = 'http://localhost:8080/api/mensajes';

  ngOnInit(): void {
    this.miId = Number(localStorage.getItem('userId') || localStorage.getItem('id')); 
    this.cargarConexiones();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  cargarConexiones(): void {
    this.usuarioService.obtenerMisConexiones().subscribe({
      next: (data) => {
        this.conexiones = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar conexiones:', err)
    });
  }

  // Buscador rápido en memoria
  get conexionesFiltradas() {
    if (!this.busqueda.trim()) return this.conexiones;
    return this.conexiones.filter(c => {
      const nombre = c.emisorId === this.miId ? c.receptorNombre : c.emisorNombre;
      return nombre.toLowerCase().includes(this.busqueda.toLowerCase());
    });
  }

  // --- LÓGICA DEL CHAT FUSIONADA ---
  abrirChat(solicitud: any): void {
    const companeroId = solicitud.emisorId === this.miId ? Number(solicitud.receptorId) : Number(solicitud.emisorId);
    const companeroNombre = solicitud.emisorId === this.miId ? solicitud.receptorNombre : solicitud.emisorNombre;
    const companeroAvatar = companeroNombre.charAt(0).toUpperCase();

    // Activamos el chat en la parte derecha
    this.chatActivo = { id: companeroId, nombre: companeroNombre, avatar: companeroAvatar };
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    if (!this.chatActivo) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/historial/${this.chatActivo.id}`, { headers }).subscribe({
      next: (data) => {
        this.historial = data;
        this.cdr.detectChanges(); 
        this.scrollToBottom(); 
      },
      error: (err) => console.error('Error al cargar el historial:', err)
    });
  }

  enviar(): void {
    if (!this.nuevoMensaje.trim() || !this.chatActivo) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`${this.apiUrl}/enviar/${this.chatActivo.id}`, this.nuevoMensaje, { headers, responseType: 'text' }).subscribe({
      next: () => {
        this.nuevoMensaje = ''; 
        this.mostrarEmojis = false; 
        this.cargarHistorial(); 
      },
      error: (err) => console.error('Error al enviar el mensaje:', err)
    });
  }

  toggleEmojis(): void { this.mostrarEmojis = !this.mostrarEmojis; }
  addEmoji(emoji: string): void { this.nuevoMensaje += emoji; }
}