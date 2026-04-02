import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Explore } from './components/explore/explore'; 

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'explore', component: Explore }, 
  { path: '**', redirectTo: '' }
];