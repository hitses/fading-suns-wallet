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
  wyrd: number;
  // Inventario
  bag: string[];
}
