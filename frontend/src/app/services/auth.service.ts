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
          
          // 👇 ¡AÑADE ESTA LÍNEA AQUÍ PARA GUARDAR EL NOMBRE DEL USUARIO! 👇
          if (response.nombre) {
            localStorage.setItem('usuario_nombre', response.nombre);
          }

          this.currentUserToken.set(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserToken.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserToken() !== null;
  }
}