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

  // 🔄 Interruptor de modo (Login vs Registro)
  isLoginMode = true;

  // Variables bindeadas al formulario
  email = '';
  password = ''; 
  nombre = '';
  edad: number | null = null;
  genero = '';
  peso: number | null = null;

  // Signal para manejar los errores visuales de la interfaz
  errorMessage = signal<string | null>(null);

  // Alternar entre pantallas
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage.set(null); // Limpiamos errores al cambiar de modo
  }

  // Función principal que decide qué hacer al darle al botón
  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.isLoginMode) {
      this.ejecutarLogin();
    } else {
      this.ejecutarRegistro();
    }
  }

  private ejecutarLogin(): void {
    const credenciales = { email: this.email, password: this.password };

    this.authService.login(credenciales).subscribe({
      next: (response) => {
        console.log('¡Login correcto! Token guardado de forma segura.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage.set('Email o contraseña incorrectos. Inténtalo de nuevo.');
      }
    });
  }

  private ejecutarRegistro(): void {
    const nuevoUsuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      edad: this.edad,
      genero: this.genero,
      peso: this.peso
    };

    this.authService.register(nuevoUsuario).subscribe({
      next: (response) => {
        console.log('¡Cuenta creada con éxito! Iniciando sesión automáticamente...');
        
        // 🔥 LA MAGIA: En lugar de mandarlo a la pantalla de login, 
        // llamamos directamente a la función de login por debajo de la mesa.
        this.ejecutarLogin();
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.errorMessage.set('Hubo un problema al crear la cuenta. Revisa los datos o prueba con otro email.');
      }
    });
  }
  
}