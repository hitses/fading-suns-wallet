import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Character } from '../../interfaces/character';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { CreateCharacter } from './components/create-character/create-character';
import { Subscription } from 'rxjs';
import { CharacterService } from '../character/character.service';

@Component({
  selector: 'character-list-page',
  imports: [RouterLink, TitleCasePipe, CreateCharacter],
  templateUrl: './character-list.html',
})
export default class CharacterList implements OnInit {
  characters: WritableSignal<Character[]> = signal<Character[]>([]);
  private subscriptions: Subscription = new Subscription();

  private readonly characterService = inject(CharacterService);

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.subscriptions.add(
      this.characterService.getAllPlayers().subscribe({
        next: (data: Character[]) => {
          this.characters.set(data);
          console.log('Jugadores cargados:', this.characters());
        },
        error: (err) => console.error('Error al cargar jugadores:', err),
      }),
    );
  }
}
