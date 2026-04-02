import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  // 1. EL USUARIO ACTUAL (Luis)
  // Ampliamos sus datos para que el algoritmo pueda comparar
  currentUser = signal({
    name: 'Luis',
    gym: 'Basic-Fit Sur',
    level: 'Avanzada',
    focus: 'Fuerza'
  });

  // 2. SIMULACIÓN DE LA BASE DE DATOS
  // Esta es la lista "cruda" que nos enviaría tu compañero del backend
  allUsersFromDB = signal([
    // Ana tiene 3 coincidencias: Gym, Nivel y Enfoque (Será el Top Match)
    { id: 1, name: 'Ana Gómez', initial: 'A', gym: 'Basic-Fit Sur', level: 'Avanzada', focus: 'Fuerza' },
    // Carlos tiene 0 coincidencias (No debe salir)
    { id: 2, name: 'Carlos Ruiz', initial: 'C', gym: 'Basic-Fit Centro', level: 'Intermedio', focus: 'Cardio' },
    // María tiene 2 coincidencias: Gym y Enfoque (Debe salir, pero sin la insignia TOP)
    { id: 3, name: 'María López', initial: 'M', gym: 'Basic-Fit Sur', level: 'Principiante', focus: 'Fuerza' },
    // Pedro tiene solo 1 coincidencia: Nivel (No debe salir porque necesitamos 2 o más)
    { id: 4, name: 'Pedro Sánchez', initial: 'P', gym: 'McFit Norte', level: 'Avanzada', focus: 'Cardio' }
  ]);

  // 3. EL ALGORITMO DE MATCHING (Totalmente dinámico)
  // computed() vigila los datos. Si algo cambia, recalcula todo automáticamente.
  suggestedMatches = computed(() => {
    const current = this.currentUser(); // Obtenemos a Luis
    const allUsers = this.allUsersFromDB(); // Obtenemos a los demás

    // Paso A: Contar las coincidencias de cada usuario
    const evaluatedUsers = allUsers.map(user => {
      let coincidences = 0;
      if (user.gym === current.gym) coincidences++;
      if (user.level === current.level) coincidences++;
      if (user.focus === current.focus) coincidences++;
      
      // Devolvemos al usuario con una nueva propiedad que dice cuántas coincidencias tuvo
      return { ...user, coincidences };
    });

    // Paso B: Filtrar (Nos quedamos SOLO con los que tengan 2 o más coincidencias)
    const matches = evaluatedUsers.filter(user => user.coincidences >= 2);

    // Paso C: Ordenar (El que tenga más coincidencias va primero)
    matches.sort((a, b) => b.coincidences - a.coincidences);

    // Paso D: Asignar la insignia de "TOP MATCH" al primero de la lista
    return matches.map((match, index) => ({
      ...match,
      isTopMatch: index === 0 // Será true solo para el elemento 0 (el primero)
    }));
  });

  // 4. DATOS VINCULADOS MÁGICAMENTE
  // En lugar de poner un número fijo, le decimos que lea cuántos matches devolvió el algoritmo
  newProfiles = computed(() => this.suggestedMatches().length);
  
  // Progreso y atajos (Esto se mantiene igual)
  completedDays = signal(3);
  totalDays = signal(4);
  shortcuts = signal({
    nextSession: 'Hoy, 18:00h',
    unreadMessages: 2
  });

  // NUEVO: Variable para controlar si estamos editando
  isEditingSession = signal(false);

  // NUEVO: Función para alternar entre Editar y Guardar
  toggleEdit() {
    this.isEditingSession.update(v => !v);
  }

  // NUEVO: Función para actualizar el texto mientras el usuario escribe
  updateSession(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.shortcuts.update(current => ({
      ...current,
      nextSession: inputElement.value
    }));
  }
}