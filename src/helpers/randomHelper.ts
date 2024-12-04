// Función para generar un evento aleatorio (encuentro sorpresa o recompensa)
export function generateRandomEvent(): string {
    const event = Math.random() > 0.5 ? 'encuentro sorpresa' : 'recompensa';
    return event;  // Cambié esto para generar eventos aleatorios
  }