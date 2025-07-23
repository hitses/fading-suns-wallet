import { NgClass } from '@angular/common';
import {
  Component,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { Character } from '../../../../../interfaces/character';
import { CharacterService } from '../../../character.service';

@Component({
  selector: 'vitality-component',
  imports: [NgClass],
  templateUrl: './vitality.html',
})
export class Vitality {
  character = input.required<Character | undefined>();
  health: WritableSignal<number> = signal<number>(0);
  currentHealth: WritableSignal<number> = signal<number>(0);

  points = [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  numberPoints = [
    18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 1, 2, 3, 4, 5,
  ];

  crossedPoints: WritableSignal<Set<number>> = signal(new Set<number>());

  private readonly characterService = inject(CharacterService);

  ngOnInit(): void {
    const char = this.character();

    this.health.set(char!.health);
    this.currentHealth.set(char!.currentHealth);

    if (char && char.health !== undefined && char.currentHealth !== undefined) {
      const initialDamage = char.health - char.currentHealth;

      if (initialDamage > 0) {
        const initialCrossed = new Set<number>();

        // Marcar los puntos desde la vitalidad máxima hacia abajo, hasta la vitalidad actual + 1
        for (let i = char.health; i > char.currentHealth; i--) {
          initialCrossed.add(i);
        }

        this.crossedPoints.set(initialCrossed);
      }
    }
  }

  onClickPoint(clickedPoint: number): void {
    const health = this.health();
    const currentHealth = this.currentHealth();

    if (currentHealth === undefined) return;

    // Un punto no es clicable si es mayor que la vitalidad máxima
    if (clickedPoint > health) return;

    const currentCrossedPoints = new Set(this.crossedPoints());
    const hasCross = currentCrossedPoints.has(clickedPoint);

    // Añadir cruces (simulando daño)
    // Marca el punto clicado y todos los puntos *superiores*
    if (!hasCross)
      for (let i = currentHealth; i >= clickedPoint; i--) {
        if (i <= currentHealth) {
          currentCrossedPoints.add(i);
        }
      }
    // Quitar cruces (simulando recuperación)
    // Desmarca el punto clicado y todos los puntos *inferiores*
    else
      for (let i = 1; i <= clickedPoint; i++) {
        currentCrossedPoints.delete(i);
      }

    this.crossedPoints.set(currentCrossedPoints);

    // Actualizar el Character desde el servicio de Character
    const newCurrentHealth = health - this.crossedPoints().size;

    this.characterService
      .updateCharacter({
        ...this.character()!,
        currentHealth: newCurrentHealth,
      })
      .subscribe({
        next: (data: Character) => this.currentHealth.set(data.currentHealth),
        error: (err) => console.error('Error al actualizar personaje:', err),
      });
  }

  // Determina si un punto específico debe mostrar una cruz
  shouldShowCross(point: number): boolean {
    return this.crossedPoints().has(point);
  }
}
