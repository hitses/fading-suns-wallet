import { Component, signal, WritableSignal } from '@angular/core';
import { Character } from '../../interfaces/character';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { CreateCharacter } from './components/create-character/create-character';

@Component({
  selector: 'character-list-page',
  imports: [RouterLink, TitleCasePipe, CreateCharacter],
  templateUrl: './character-list.html',
})
export default class CharacterList {
  pjs: WritableSignal<Character[]> = signal<Character[]>([]);
}
