import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Le preguntamos a tu servicio si el usuario tiene un Token válido
  if (authService.isAuthenticated()) {
    return true; // Le abrimos la puerta, puede pasar a la pantalla
  } else {
    // Si no está logueado, lo mandamos de vuelta al Login
    router.navigate(['/login']);
    return false; // Le bloqueamos el paso
  }
};