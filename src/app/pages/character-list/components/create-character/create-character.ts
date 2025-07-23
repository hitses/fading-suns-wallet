import {
  Component,
  inject,
  OnDestroy,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import slugify from 'slugify';
import { Plus } from '../../../../images/plus/plus';
import { Character } from '../../../../interfaces/character';
import { Subscription } from 'rxjs';
import { CharacterService } from '../../../character/character.service';

@Component({
  selector: 'create-character-component',
  imports: [ReactiveFormsModule, Plus],
  templateUrl: './create-character.html',
})
export class CreateCharacter implements OnDestroy {
  newCharacter = output<Character>();

  showForm: WritableSignal<boolean> = signal<boolean>(false);
  private subscriptions: Subscription = new Subscription();

  private fb = inject(FormBuilder);
  private readonly characterService = inject(CharacterService);

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createCharacterForm: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    ],
    fenix: ['', [Validators.required, Validators.min(0)]],
    blason: [, [Validators.required, Validators.min(0), Validators.max(1)]],
    ala: ['', [Validators.required, Validators.min(0), Validators.max(3)]],
    cresta: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    exp: ['', [Validators.required, Validators.min(0)]],
    health: ['', [Validators.required, Validators.min(5), Validators.max(18)]],
    wyrd: ['', [Validators.required, Validators.min(0), Validators.max(18)]],
  });

  toggleShowForm() {
    this.showForm.set(!this.showForm());
  }

  // Validación de los campos numéricos del formulario
  validateNumericInputs(event: any, min: number, max?: number) {
    const inputElement = event.target as HTMLInputElement;
    const formControlName = inputElement.getAttribute('formControlName');
    let value = parseFloat(inputElement.value);

    if (isNaN(value)) value = min;

    if (value < min) value = min;
    else if (max !== undefined && value > max) value = max;

    inputElement.value = String(value);

    if (formControlName)
      this.createCharacterForm
        .get(formControlName)
        ?.setValue(value, { emitEvent: false });
  }

  submit() {
    if (this.createCharacterForm.invalid) {
      this.createCharacterForm.markAllAsTouched();

      return;
    }

    const newCharacter: Character = {
      name: this.createCharacterForm.value.name,
      slug: slugify(this.createCharacterForm.value.name, { lower: true }),
      fenix: this.createCharacterForm.value.fenix,
      blason: this.createCharacterForm.value.blason,
      ala: this.createCharacterForm.value.ala,
      cresta: this.createCharacterForm.value.cresta,
      exp: this.createCharacterForm.value.exp,
      health: this.createCharacterForm.value.health,
      currentHealth: this.createCharacterForm.value.health,
      wyrd: this.createCharacterForm.value.wyrd,
      currentWyrd: this.createCharacterForm.value.wyrd,
      bag: [],
    };

    this.subscriptions.add(
      this.characterService.addCharacter(newCharacter).subscribe({
        next: (id) => {
          this.createCharacterForm.reset();
          this.toggleShowForm();
          this.newCharacter.emit(newCharacter);
        },
        error: (err) => console.error('Error al añadir jugador:', err),
      }),
    );
  }
}
