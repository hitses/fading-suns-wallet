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
import { Vitality } from './components/vitality/vitality';
import { Wyrd } from './components/wyrd/wyrd';
import { Experience } from './components/experience/experience';

@Component({
  selector: 'attributes-component',
  imports: [Vitality, Wyrd, Experience],
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
        error: (err) => this.character.set(undefined),
      }),
    );
  }
}
