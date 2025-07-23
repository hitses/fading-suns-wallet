import {
  Component,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { Character } from '../../../../../interfaces/character';
import { CharacterService } from '../../../character.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'wyrd-component',
  imports: [NgClass],
  templateUrl: './wyrd.html',
})
export class Wyrd {
  character = input.required<Character | undefined>();
  wyrd: WritableSignal<number> = signal<number>(0);
  currentWyrd: WritableSignal<number> = signal<number>(0);
  crossedPoints: WritableSignal<Set<number>> = signal(new Set<number>());

  points = [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  private readonly characterService = inject(CharacterService);

  ngOnInit(): void {
    const char = this.character();

    this.wyrd.set(char!.wyrd);
    this.currentWyrd.set(char!.currentWyrd);

    if (char && char.wyrd !== undefined && char.currentWyrd !== undefined) {
      const initialWyrd = char.wyrd - char.currentWyrd;

      if (initialWyrd > 0) {
        const initialCrossed = new Set<number>();

        // Marcar los puntos desde el wyrd máximo hacia abajo, hasta el wyrd actual + 1
        for (let i = char.wyrd; i > char.currentWyrd; i--) {
          initialCrossed.add(i);
        }

        this.crossedPoints.set(initialCrossed);
      }
    }
  }

  onClickPoint(clickedPoint: number): void {
    const wyrd = this.wyrd();
    const currentWyrd = this.currentWyrd();

    if (currentWyrd === undefined) return;

    // Un punto no es clicable si es mayor que el wyrd máximo
    if (clickedPoint > wyrd) return;

    const currentCrossedPoints = new Set(this.crossedPoints());
    const hasCross = currentCrossedPoints.has(clickedPoint);

    // Añadir cruces (simulando daño)
    // Marca el punto clicado y todos los puntos *superiores*
    if (!hasCross)
      for (let i = currentWyrd; i >= clickedPoint; i--) {
        if (i <= currentWyrd) currentCrossedPoints.add(i);
      }
    // Quitar cruces (simulando recuperación)
    // Desmarca el punto clicado y todos los puntos *inferiores*
    else
      for (let i = 1; i <= clickedPoint; i++) {
        currentCrossedPoints.delete(i);
      }

    this.crossedPoints.set(currentCrossedPoints);

    // Actualizar el Character desde el servicio de Character
    const newCurrentWyrd = wyrd - this.crossedPoints().size;

    this.characterService
      .updateCharacter({
        ...this.character()!,
        currentWyrd: newCurrentWyrd,
      })
      .subscribe({
        next: (data: Character) => this.currentWyrd.set(data.currentWyrd),
        error: (err) => console.error('Error al actualizar personaje:', err),
      });
  }

  // Determina si un punto específico debe mostrar una cruz
  shouldShowCross(point: number): boolean {
    return this.crossedPoints().has(point);
  }
}
