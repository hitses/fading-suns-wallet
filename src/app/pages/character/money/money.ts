import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CharacterService } from '../character.service';
import { Character } from '../../../interfaces/character';

@Component({
  selector: 'money-component',
  imports: [],
  templateUrl: './money.html',
})
export default class Money implements OnInit, OnDestroy {
  character: WritableSignal<Character | undefined> = signal<
    Character | undefined
  >(undefined);
  private subscriptions: Subscription = new Subscription();

  private readonly route = inject(ActivatedRoute);
  private readonly characterService = inject(CharacterService);

  ngOnInit(): void {
    this.loadCharacterFromUrl();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCharacterFromUrl(): void {
    this.subscriptions.add(
      this.route.parent!.paramMap.subscribe((params) => {
        const slugValue = params.get('slug');

        if (slugValue) this.getCharacter(slugValue);
        else this.character.set(undefined);
      }),
    );
  }

  getCharacter(slug: string | null): void {
    this.subscriptions.add(
      this.characterService.getCharacterBySlug(slug).subscribe({
        next: (data: Character | undefined) => {
          if (data) this.character.set(data);
          else this.character.set(undefined);
        },
        error: (err) => {
          console.error('Error al cargar personaje:', err);
          this.character.set(undefined);
        },
      }),
    );
  }

  saveCharacter(): void {
    this.subscriptions.add(
      this.characterService.updateCharacter(this.character()!).subscribe({
        next: (data: Character) => this.character.set(data),
        error: (err) => console.error('Error al actualizar personaje:', err),
      }),
    );
  }

  incrementAttribute(currency: keyof Character, value: number): void {
    (this.character()![currency] as number) += value;
  }

  decrementAttribute(currency: keyof Character, value: number): void {
    if ((this.character()![currency] as number) - value >= 0) {
      (this.character()![currency] as number) -= value;
    }
  }

  plusFenix(value: number): void {
    this.incrementAttribute('fenix', value);

    this.saveCharacter();
  }

  minusFenix(value: number): void {
    this.decrementAttribute('fenix', value);

    this.saveCharacter();
  }

  plusBlason(): void {
    if (this.character()!.blason === 1) {
      this.decrementAttribute('blason', 1);
      this.incrementAttribute('fenix', 1);
    } else this.incrementAttribute('blason', 1);

    this.saveCharacter();
  }

  minusBlason(): void {
    if (this.character()!.blason <= 0 && this.character()!.fenix >= 1) {
      this.incrementAttribute('blason', 1);
      this.decrementAttribute('fenix', 1);
    } else this.decrementAttribute('blason', 1);

    this.saveCharacter();
  }

  plusAla(): void {
    if (this.character()!.ala === 3) {
      this.decrementAttribute('ala', 3);
      this.incrementAttribute('blason', 1);
      if (this.character()!.blason >= 2) {
        this.decrementAttribute('blason', 2);
        this.incrementAttribute('fenix', 1);
      }
    } else this.incrementAttribute('ala', 1);

    this.saveCharacter();
  }

  minusAla(): void {
    if (this.character()!.ala <= 0 && this.character()!.blason >= 1) {
      if (this.character()!.blason === 1) {
        this.decrementAttribute('blason', 1);
        this.incrementAttribute('ala', 3);
      }
    } else if (
      this.character()!.ala <= 0 &&
      this.character()!.blason <= 0 &&
      this.character()!.fenix >= 1
    ) {
      this.decrementAttribute('fenix', 1);
      this.incrementAttribute('blason', 1);
      this.incrementAttribute('ala', 3);
    } else if (
      this.character()!.ala <= 0 &&
      this.character()!.blason <= 0 &&
      this.character()!.fenix <= 0
    )
      this.decrementAttribute('ala', 0);
    else this.decrementAttribute('ala', 1);

    this.saveCharacter();
  }

  plusCresta(value: number): void {
    this.incrementAttribute('cresta', value);

    while (this.character()!.cresta >= 100) {
      this.decrementAttribute('cresta', 100);
      this.incrementAttribute('ala', 1);
      if (this.character()!.ala >= 4) {
        this.decrementAttribute('ala', 4);
        this.incrementAttribute('blason', 1);
        if (this.character()!.blason >= 2) {
          this.decrementAttribute('blason', 2);
          this.incrementAttribute('fenix', 1);
        }
      }
    }

    this.saveCharacter();
  }

  minusCresta(value: number): void {
    if (this.character()!.cresta - value < 0) {
      if (this.character()!.ala >= 1) {
        this.decrementAttribute('ala', 1);
        this.incrementAttribute('cresta', 100 - value);
      } else if (this.character()!.blason >= 1) {
        this.decrementAttribute('blason', 1);
        this.incrementAttribute('ala', 3);
        this.incrementAttribute('cresta', 100 - value);
      } else if (this.character()!.fenix >= 1) {
        this.decrementAttribute('fenix', 1);
        this.incrementAttribute('blason', 1);
        this.incrementAttribute('ala', 3);
        this.incrementAttribute('cresta', 100 - value);
      }
    } else this.decrementAttribute('cresta', value);

    this.saveCharacter();
  }
}
