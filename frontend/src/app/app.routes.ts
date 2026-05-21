import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; 
import { DashboardComponent } from './components/dashboard/dashboard'; 
import { SolicitudesComponent } from './components/solicitudes/solicitudes';
import { MisConexionesComponent } from './components/mis-conexiones/mis-conexiones';
import { ChatComponent } from './components/chat/chat'; 
import { Explore } from './components/explore/explore';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'solicitudes', component: SolicitudesComponent },
  { path: 'conexiones', component: MisConexionesComponent },
  { path: 'explorar', component: Explore },
  
  // 💬 El chat DEBE estar aquí arriba, antes de las redirecciones comodín
  { path: 'chat/:id', component: ChatComponent }, 

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // 🚨 EL COMODÍN DEBE SER SIEMPRE LA ÚLTIMA LÍNEA DEL ARRAY 🚨
  { path: '**', redirectTo: '/dashboard' } 
];