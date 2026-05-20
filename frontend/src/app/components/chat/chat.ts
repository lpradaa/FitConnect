import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service'; // 🔥 Importamos el servicio

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private usuarioService = inject(UsuarioService);

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  companeroId!: number;
  companeroNombre: string = 'Cargando...'; // 🔥 Guardará el nombre real
  companeroAvatar: string = '👤';          // 🔥 Guardará el avatar real
  nuevoMensaje: string = '';
  historial: any[] = [];
  
  // 🔥 Lógica del menú de emojis
  mostrarEmojis: boolean = false;
  emojisRapidos = ['😂', '😍', '💪', '🔥', '🏋️‍♂️', '🏃‍♀️', '👏', '💯', '🙏', '👀'];

  private apiUrl = 'http://localhost:8080/api/mensajes';

  ngOnInit(): void {
    this.companeroId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCompaneroInfo(); // 🔥 Llamamos a la info real
    this.cargarHistorial();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  // 🔥 NUEVO: Buscamos el nombre real de nuestro compañero en la lista de conexiones
  cargarCompaneroInfo(): void {
    this.usuarioService.obtenerMisConexiones().subscribe({
      next: (conexiones) => {
        const conexion = conexiones.find(c => c.emisorId === this.companeroId || c.receptorId === this.companeroId);
        if (conexion) {
          // Si él nos la envió, es el emisor. Si se la enviamos nosotros, es el receptor.
          this.companeroNombre = conexion.emisorId === this.companeroId ? conexion.emisorNombre : conexion.receptorNombre;
          // Si tuviéramos avatar lo ponemos, si no, su inicial mayúscula
          this.companeroAvatar = this.companeroNombre.charAt(0).toUpperCase(); 
        } else {
          this.companeroNombre = 'Compañero';
        }
      },
      error: (err) => console.error('Error al cargar info del compañero:', err)
    });
  }

  cargarHistorial(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${this.apiUrl}/historial/${this.companeroId}`, { headers }).subscribe({
      next: (data) => {
        this.historial = data;
        this.cdr.detectChanges(); 
        this.scrollToBottom(); 
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
        this.mostrarEmojis = false; // 🔥 Cerramos emojis al enviar
        this.cargarHistorial(); 
      },
      error: (err) => console.error('Error al enviar el mensaje:', err)
    });
  }

  // 🔥 NUEVO: Alternar menú de emojis
  toggleEmojis(): void {
    this.mostrarEmojis = !this.mostrarEmojis;
  }

  // 🔥 NUEVO: Añadir emoji al texto
  addEmoji(emoji: string): void {
    this.nuevoMensaje += emoji;
  }
}