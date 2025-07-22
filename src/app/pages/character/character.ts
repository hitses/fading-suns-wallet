import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CharacterService } from './character.service';
import { Character as ICharacter } from '../../interfaces/character';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'character-page',
  imports: [],
  templateUrl: './character.html',
})
export default class Character implements OnInit, OnDestroy {
  character: WritableSignal<ICharacter | undefined> = signal<
    ICharacter | undefined
  >(undefined);
  private readonly slug: WritableSignal<string | null> = signal<string>('');
  private subscriptions: Subscription = new Subscription();

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly characterService = inject(CharacterService);

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
        this.slug.set(params.get('slug'));
        if (this.slug) {
          console.log('Slug obtenido de la URL:', this.slug());
          // Ahora puedes usar este slug para cargar el personaje desde tu DB local
          this.getCharacter(this.slug());
        } else {
          console.warn('No se encontró un slug en la URL.');
          this.character.set(undefined);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getCharacter(slug: string | null): void {
    this.subscriptions.add(
      this.characterService.getCharacterBySlug(slug).subscribe({
        next: (data: ICharacter | undefined) => {
          console.log(data);
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

  deleteCharacter(): void {
    this.subscriptions.add(
      this.characterService.deletePlayer(this.character()!.id!).subscribe({
        next: (data: boolean[] | unknown[]) => {
          console.log('Personaje eliminado:', data);
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Error al eliminar personaje:', err),
      }),
    );
  }
}
