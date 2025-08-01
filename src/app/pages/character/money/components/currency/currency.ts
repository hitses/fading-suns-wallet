import { Component, input, output } from '@angular/core';

@Component({
  selector: 'currency-component',
  imports: [],
  templateUrl: './currency.html',
})
export class Currency {
  currencyName = input.required<string>();
  currencyValue = input.required<number | null | undefined>();
  incrementValues = input.required<number[]>();
  decrementValues = input.required<number[]>();
  update = output<number>();
}
