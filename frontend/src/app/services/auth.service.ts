import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private URL_AUTH = 'http://localhost:8080/api/auth'; 

  // Almacén reactivo del Token recuperado del almacenamiento del navegador
  currentUserToken = signal<string | null>(localStorage.getItem('token'));

  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.URL_AUTH}/login`, credenciales).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          
          if (response.nombre) {
            localStorage.setItem('usuario_nombre', response.nombre);
          }

          // Guardamos el ID del usuario
          const userId = response.id || response.usuarioId; 
          if (userId) {
            localStorage.setItem('userId', userId.toString());
          }

          this.currentUserToken.set(response.token);
        }
      })
    );
  }

  // 🔥 MODIFICADO: Ahora apunta al endpoint correcto del backend para registrar usuarios
  // Fíjate en la última palabra de la URL (/registro)
  register(nuevoUsuario: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/usuarios/registro', nuevoUsuario);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('userId'); 
    this.currentUserToken.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserToken() !== null;
  }
}