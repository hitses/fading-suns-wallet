import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Corner } from './images/corner/corner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Corner],
  templateUrl: './app.html',
})
export class App {
  title: WritableSignal<string> = signal('Monedero');
}
