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
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'character-page',
  imports: [RouterOutlet, RouterOutlet, Navbar],
  templateUrl: './character.html',
})
export default class Character implements OnInit, OnDestroy {
  character: WritableSignal<ICharacter | undefined> = signal<
    ICharacter | undefined
  >(undefined);
  private readonly slug: WritableSignal<string | null> = signal<string>('');
  private subscriptions: Subscription = new Subscription();

  readonly router = inject(Router);
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
      this.route.paramMap.subscribe((params) => {
        this.slug.set(params.get('slug'));

        if (this.slug) this.getCharacter(this.slug());
        else this.character.set(undefined);
      }),
    );
  }

  getCharacter(slug: string | null): void {
    this.subscriptions.add(
      this.characterService.getCharacterBySlug(slug).subscribe({
        next: (data: ICharacter | undefined) => {
          if (data) this.character.set(data);
          else this.character.set(undefined);
        },
        error: (err) => this.character.set(undefined),
      }),
    );
  }

  deleteCharacter(): void {
    this.subscriptions.add(
      this.characterService.deleteCharacter(this.character()!.id!).subscribe({
        next: (data: boolean[] | unknown[]) => this.router.navigate(['/']),
        error: (err) => console.error('Error al eliminar personaje:', err),
      }),
    );
  }
}
