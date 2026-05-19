import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-explore',
  imports: [],
  templateUrl: './explore.html',
  styleUrl: './explore.scss'
})
export class Explore {
  // Datos base de Luis para comparar
  currentUser = signal({
    gym: 'Basic-Fit Sur',
    level: 'Avanzado',
    focus: 'Fuerza',
    time: 'Tardes'
  });

  // Base de datos simulada
  allUsersFromDB = signal([
    { 
      id: 1, name: 'Ana Gómez', initial: 'A', gym: 'Basic-Fit Sur', 
      level: 'Avanzada', focus: 'Fuerza', time: 'Tardes', 
      bio: '"Llevo 3 años entrenando powerlifting. Busco un spotter de confianza para tirar máximas en press banca y sentadilla."' 
    },
    { 
      id: 2, name: 'Carlos Ruiz', initial: 'C', gym: 'Basic-Fit Centro', 
      level: 'Principiante', focus: 'Pérdida peso', time: 'Mañanas', 
      bio: '"Acabo de empezar. Me da un poco de vergüenza ir a la zona de pesas libres, busco alguien para aprender juntos."' 
    },
    { 
      id: 3, name: 'Laura Martín', initial: 'L', gym: 'McFit Norte', 
      level: 'Intermedio', focus: 'Hipertrofia', time: 'Tardes', 
      bio: '"Rutina dividida 4 días a la semana. Muy constante y enfocada en mejorar la técnica."' 
    },
    { 
      id: 4, name: 'David Torres', initial: 'D', gym: 'Basic-Fit Sur', 
      level: 'Avanzado', focus: 'Fuerza', time: 'Mediodía', 
      bio: '"Entrenamientos intensos y cortos. Si buscas charlar entre series, no soy tu chico. A darle duro."' 
    }
  ]);

  // Filtros rápidos (por ahora visuales)
  filters = signal(['Todos', 'Basic-Fit Sur', 'Avanzados', 'Tardes']);
  activeFilter = signal('Todos');

  // Algoritmo: Ordena de más afín a menos afín
  sortedUsers = computed(() => {
    const current = this.currentUser();
    const evaluated = this.allUsersFromDB().map(user => {
      let coincidences = 0;
      if (user.gym === current.gym) coincidences++;
      // Comprobamos si incluye la raíz para que 'Avanzado' y 'Avanzada' hagan match
      if (user.level.includes('Avanzad') && current.level.includes('Avanzad')) coincidences++; 
      if (user.focus === current.focus) coincidences++;
      if (user.time === current.time) coincidences++;
      
      return { ...user, coincidences };
    });

    // Ordenamos descendente (el que tenga más coincidencias va primero)
    return evaluated.sort((a, b) => b.coincidences - a.coincidences);
  });
}