export interface Character {
  id?: number;
  name: string;
  slug: string;
  // Monedas
  fenix: number;
  blason: number;
  ala: number;
  cresta: number;
  // Experiencia
  exp: number;
  // Atributos
  health: number;
  currentHealth: number;
  wyrd: number;
  currentWyrd: number;
  // Inventario
  bag: string[];
}
