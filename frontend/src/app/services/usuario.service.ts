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
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any[]>(`${this.apiUrlUsuarios}/matches`, { headers });
  }

  // 2. Enviar una solicitud de conexión a otro usuario
  enviarSolicitudConexion(receptorId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<any>(`${this.apiUrlSolicitudes}/enviar/${receptorId}`, {}, { headers });
  }

  // 3. Obtener las solicitudes que me han enviado y están PENDIENTES
  obtenerSolicitudesPendientes(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any[]>(`${this.apiUrlSolicitudes}/pendientes`, { headers });
  }

  // 4. Aceptar o Rechazar una solicitud
  responderSolicitud(solicitudId: number, estado: 'ACEPTADA' | 'RECHAZADA'): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put<any>(`${this.apiUrlSolicitudes}/responder/${solicitudId}?estado=${estado}`, {}, { headers });
  }

  // 5. Obtener compañeros (Solicitudes ACEPTADAS)
  obtenerMisConexiones(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any[]>(`${this.apiUrlSolicitudes}/aceptadas`, { headers });
  }

  // 🔥 NUEVO: 6. Actualizar el perfil del usuario (Avatar, Datos y Horarios)
  actualizarPerfil(perfilData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    // Nota: Asumo que en tu backend el endpoint es PUT /api/usuarios/perfil
    // Si tu ruta es distinta (ej: /api/usuarios/actualizar), cámbiala aquí
    return this.http.put<any>(`${this.apiUrlUsuarios}/perfil`, perfilData, { headers });
  }
}