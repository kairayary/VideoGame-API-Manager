
// Cálculo de experiencia con bonus opcional por dificultad

  export function calculateExperience(level: number, missionDifficulty?: number): number {
    const baseExperience = level * 100;
    if (missionDifficulty) {
        return baseExperience + missionDifficulty * 10; // Bonus por dificultad
    };
    return baseExperience;
};

  // Función para determinar la probabilidad de éxito de una misión
  export function successProbability(characterLevel: number, missionDifficulty: number): boolean {
    const probability = (characterLevel / missionDifficulty) * 100;
    return Math.random() * 100 <= probability;  // Cambié esta función para usar un cálculo de probabilidad
  };