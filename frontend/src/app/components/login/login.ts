import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables bindeadas al formulario de HTML
  email = '';
  password = ''; 

  // Signal para manejar los errores visuales de la interfaz
  errorMessage = signal<string | null>(null);

  onLogin(): void {
    this.errorMessage.set(null); // Limpiamos errores de intentos previos

    // Estructuramos el DTO exactamente como lo pide el UsuarioLoginDTO de Java
    const credenciales = {
      email: this.email,
      password: this.password 
    };

    this.authService.login(credenciales).subscribe({
      next: (response) => {
        console.log('¡Login correcto! Token guardado de forma segura.');
        // Redirección inmediata al Dashboard tras recibir el OK del servidor
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en el login recibido del backend:', err);
        this.errorMessage.set('Email o contraseña incorrectos. Inténtalo de nuevo.');
      }
    });
  }
}