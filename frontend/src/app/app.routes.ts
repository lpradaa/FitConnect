import { Routes } from '@angular/router';
// Importamos nuestro nuevo componente
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  // Cuando la URL esté vacía (la página principal), carga el Dashboard
  { path: '', component: Dashboard },
  // Si el usuario escribe una ruta que no existe, lo devolvemos a la principal
  { path: '**', redirectTo: '' }
];