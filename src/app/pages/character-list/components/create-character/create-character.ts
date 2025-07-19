import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Plus } from '../../../../images/plus/plus';

@Component({
  selector: 'create-character-component',
  imports: [ReactiveFormsModule, Plus],
  templateUrl: './create-character.html',
})
export class CreateCharacter {
  showForm: WritableSignal<boolean> = signal<boolean>(true);

  private fb = inject(FormBuilder);

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
    console.log(this.createCharacterForm.value);
  }
}
