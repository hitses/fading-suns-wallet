import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'plus-image',
  imports: [NgClass],
  templateUrl: './plus.html',
})
export class Plus {
  showForm = input.required<boolean>();
}
