import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  isSidebarOpen = signal(false);
  isLoggedIn = signal(true);

  // ¡Añadimos esta nueva variable! 
  // Más adelante, esto se llenará con lo que responda el backend.
  currentUser = signal({
    name: 'Luis Padra',
    email: 'ffff@ffff',
    initial: 'L' // La inicial para el avatar
  });

  toggleSidebar() {
    this.isSidebarOpen.update(isOpen => !isOpen);
  }

  toggleSession() {
    this.isLoggedIn.update(loggedIn => !loggedIn);
    if (!this.isLoggedIn()) {
      this.isSidebarOpen.set(false);
    }
  }
}