import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { LoginComponent } from './components/login/login'; // O como se llame vuestro login
import { SolicitudesComponent } from './components/solicitudes/solicitudes'; // 👈 Importamos vuestro nuevo componente

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard },
  
  // 🚏 LA NUEVA RUTA GLOBAL:
  { path: 'solicitudes', component: SolicitudesComponent }, 
  
  // Ruta por defecto (si pones la URL vacía, te manda al login o al dashboard)
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Wildcard por si ponen una ruta rota
  { path: '**', redirectTo: '/dashboard' }
];