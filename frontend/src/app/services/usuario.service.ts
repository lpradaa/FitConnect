import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // URLs de tu backend en Spring Boot
  private apiUrlUsuarios = 'http://localhost:8080/api/usuarios';
  private apiUrlSolicitudes = 'http://localhost:8080/api/solicitudes';

  constructor(private http: HttpClient) {}

  // 1. Obtener la lista de matches (Compañeros compatibles)
  getMatches(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrlUsuarios}/matches`, { headers });
  }

  // 2. Enviar una solicitud de conexión a otro usuario
  enviarSolicitudConexion(receptorId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Hacemos un POST. Como no requiere body, le pasamos un objeto vacío {}
    return this.http.post<any>(`${this.apiUrlSolicitudes}/enviar/${receptorId}`, {}, { headers });
  }

  // 3. Obtener las solicitudes que me han enviado y están PENDIENTES
  obtenerSolicitudesPendientes(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrlSolicitudes}/pendientes`, { headers });
  }

  // 4. Aceptar o Rechazar una solicitud
  responderSolicitud(solicitudId: number, estado: 'ACEPTADA' | 'RECHAZADA'): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Hacemos un PUT pasando el estado como parámetro en la URL, tal como pide tu Spring Boot
    return this.http.put<any>(`${this.apiUrlSolicitudes}/responder/${solicitudId}?estado=${estado}`, {}, { headers });
  }
  
}