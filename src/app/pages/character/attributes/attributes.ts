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
  selector: 'attributes-component',
  imports: [],
  templateUrl: './attributes.html',
})
export default class Attributes implements OnInit, OnDestroy {
  character: WritableSignal<Character | undefined> = signal<
    Character | undefined
  >(undefined);
  private readonly slug: WritableSignal<string | null> = signal<string>('');
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

        if (slugValue) {
          console.log('Slug obtenido del padre (URL):', slugValue);
          this.getCharacter(slugValue);
        } else {
          console.warn('No se encontró un slug en la URL del padre.');
          this.character.set(undefined);
        }
      }),
    );
  }

  getCharacter(slug: string | null): void {
    this.subscriptions.add(
      this.characterService.getCharacterBySlug(slug).subscribe({
        next: (data: Character | undefined) => {
          if (data) {
            this.character.set(data);
            console.log('Personaje cargado:', this.character());
          } else {
            console.warn(`Personaje con slug "${slug}" no encontrado.`);
            this.character.set(undefined);
          }
        },
        error: (err) => {
          console.log(err);
          console.error('Error al cargar personaje:', err);
          this.character.set(undefined);
        },
      }),
    );
  }
}
