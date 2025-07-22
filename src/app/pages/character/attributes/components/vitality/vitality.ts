import { NgClass } from '@angular/common';
import { Component, input, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'vitality-component',
  imports: [NgClass],
  templateUrl: './vitality.html',
})
export class Vitality {
  health = input.required<number | undefined>();

  points = [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  crossedPoints: WritableSignal<Set<number>> = signal(new Set<number>());

  onClickPoint(clickedPoint: number): void {
    const currentHealth = this.health();
    if (currentHealth === undefined) {
      console.warn('Vitalidad no definida.');
      return;
    }

    // Un punto no es clicable si es mayor que la vitalidad actual (es negro).
    if (clickedPoint > currentHealth) {
      console.log(
        `Punto ${clickedPoint} no clicable (está por encima de la vitalidad actual o es undefined).`,
      );
      return;
    }

    const currentCrossedPoints = new Set(this.crossedPoints());
    const hasCross = currentCrossedPoints.has(clickedPoint);

    if (!hasCross) {
      // Acción: Añadir cruces (simulando daño)
      // Marca el punto clicado y todos los puntos *superiores* hasta health()
      for (let i = currentHealth; i >= clickedPoint; i--) {
        if (i <= currentHealth) {
          currentCrossedPoints.add(i);
        }
      }
    } else {
      // Acción: Quitar cruces (simulando recuperación)
      // Desmarca el punto clicado y todos los puntos *inferiores*
      for (let i = 1; i <= clickedPoint; i++) {
        currentCrossedPoints.delete(i);
      }
    }

    this.crossedPoints.set(currentCrossedPoints);
    console.log(
      `Punto ${clickedPoint} clicado. Puntos con cruz:`,
      Array.from(this.crossedPoints()).sort((a, b) => b - a),
    );
  }

  /**
   * Determina si un punto específico debe mostrar una cruz.
   * @param point El valor del punto.
   * @returns true si debe mostrar una cruz, false en caso contrario.
   */
  shouldShowCross(point: number): boolean {
    return this.crossedPoints().has(point);
  }
}
