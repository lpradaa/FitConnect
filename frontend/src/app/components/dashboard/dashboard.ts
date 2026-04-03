import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss' // Asegúrate de que apunte a .scss
})
export class Dashboard {
  // Variables dinámicas para la pantalla
  userName = signal('Luis');
  newProfiles = signal(3);
  completedDays = signal(3);
  totalDays = signal(4);
}