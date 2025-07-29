import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Character } from '../../../interfaces/character';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../character.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'inventory-component',
  imports: [ReactiveFormsModule],
  templateUrl: './inventory.html',
})
export default class Inventory {
  character: WritableSignal<Character | undefined> = signal<
    Character | undefined
  >(undefined);
  private subscriptions: Subscription = new Subscription();

  private readonly route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private readonly characterService = inject(CharacterService);

  ngOnInit(): void {
    this.loadCharacterFromUrl();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createObjectForm: FormGroup = this.fb.group({
    object: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    ],
  });

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

  deleteObject(index: number) {
    const character = this.character();

    character?.bag.splice(index, 1);

    this.character.set(character);

    this.characterService.updateCharacter(character!).subscribe({
      next: (data: Character) => {
        this.character.set(data);
      },
      error: (err) => console.error('Error al actualizar personaje:', err),
    });
  }

  submit() {
    if (this.createObjectForm.invalid) {
      this.createObjectForm.markAllAsTouched();

      return;
    }

    const character = this.character();
    const newObject: string = this.createObjectForm.value.object.trim();

    if (character?.bag.includes(newObject)) return;

    character?.bag.push(newObject);

    this.character.set(character);

    this.characterService.updateCharacter(character!).subscribe({
      next: (data: Character) => {
        this.character.set(data);
        this.createObjectForm.reset();
      },
      error: (err) => console.error('Error al actualizar personaje:', err),
    });
  }
}
