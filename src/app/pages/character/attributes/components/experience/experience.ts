import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Character } from '../../../../../interfaces/character';
import { CharacterService } from '../../../character.service';

@Component({
  selector: 'experience-component',
  imports: [],
  templateUrl: './experience.html',
})
export class Experience implements OnInit {
  character = input.required<Character | undefined>();
  experience: WritableSignal<number> = signal<number>(0);

  private readonly characterService = inject(CharacterService);

  ngOnInit(): void {
    this.experience.set(this.character()!.exp ?? 0);
  }

  onAddExperience(): void {
    const exp = this.experience();

    this.experience.set(exp + 1);

    this.updateCharacter();
  }

  onRemoveExperience(): void {
    const exp = this.experience();

    this.experience.set(exp - 1);

    this.updateCharacter();
  }

  updateCharacter(): void {
    this.characterService
      .updateCharacter({
        ...this.character()!,
        exp: this.experience(),
      })
      .subscribe({
        next: (data: Character) => this.experience.set(data.exp),
        error: (err) => console.error('Error al actualizar personaje:', err),
      });
  }
}
