import { Component, signal, computed, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.scss'
})
export class Explore implements OnInit {
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef); // 🔥 Inyectado para forzar el repintado de la vista

  usuarios = signal<any[]>([]); 
  isFiltrosOpen = signal(false);

  // 🔥 Filtros avanzados ampliados
  filtrosActivos = signal({ 
    busqueda: '', 
    nivel: '', 
    objetivo: '',
    gimnasio: '',
    genero: '',
    edadMin: null as number | null,
    edadMax: null as number | null
  });

  // 🔥 VARIABLES PARA EL TOAST NOTIFICATION
  toast: { show: boolean, message: string, type: 'success' | 'error' } = { show: false, message: '', type: 'success' };
  private toastTimeout: any;

  // 🔥 Extraemos los gimnasios únicos de la base de datos para el filtro
  gimnasiosDisponibles = computed(() => {
    const gyms = this.usuarios()
      .map(u => u.gimnasioNombre)
      .filter(gym => gym); // Quitamos los nulos
    return [...new Set(gyms)]; // Filtramos para que no salgan repetidos
  });

  usuariosFiltrados = computed(() => {
    let list = this.usuarios();
    const f = this.filtrosActivos();
    
    // Búsqueda por texto
    if (f.busqueda.trim()) list = list.filter(u => u.nombre.toLowerCase().includes(f.busqueda.toLowerCase()));
    
    // Selectores exactos
    if (f.nivel) list = list.filter(u => u.nivel === f.nivel);
    if (f.objetivo) list = list.filter(u => u.objetivos === f.objetivo);
    if (f.gimnasio) list = list.filter(u => u.gimnasioNombre === f.gimnasio);
    if (f.genero) list = list.filter(u => u.genero === f.genero);
    
    // Rango de edades
    if (f.edadMin !== null && f.edadMin > 0) list = list.filter(u => u.edad >= f.edadMin!);
    if (f.edadMax !== null && f.edadMax > 0) list = list.filter(u => u.edad <= f.edadMax!);
    
    return list;
  });

  ngOnInit() { this.cargarComunidad(); }

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

  cargarComunidad() {
    this.usuarioService.getExplorarUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  toggleFiltros() { this.isFiltrosOpen.update(v => !v); }
  
  actualizarFiltros(campo: string, evento: any) {
    const valor = evento.target ? evento.target.value : evento;
    this.filtrosActivos.update(f => ({ ...f, [campo]: valor }));
  }

  resetearFiltros() {
    this.filtrosActivos.set({ 
      busqueda: '', nivel: '', objetivo: '', 
      gimnasio: '', genero: '', edadMin: null, edadMax: null 
    });
  }

  conectarConUsuario(id: number) {
    this.usuarioService.enviarSolicitudConexion(id).subscribe({
      next: () => {
        this.mostrarToast('¡Solicitud enviada con éxito!', 'success'); // 🔥 Usamos el toast
        this.usuarios.update(list => list.filter(u => u.id !== id));
      },
      error: (err) => {
        console.error(err);
        this.mostrarToast('Hubo un problema al conectar con el usuario.', 'error'); // 🔥 Usamos el toast
      }
    });
  }
}