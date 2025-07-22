import { Component, input, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Character } from '../../../../interfaces/character';

@Component({
  selector: 'navbar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  character = input.required<Character | undefined>();

  navItems: WritableSignal<{ name: string; link: string }[]> = signal<
    { name: string; link: string }[]
  >([
    { name: 'Dinero', link: 'dinero' },
    { name: 'Atributos', link: 'atributos' },
    { name: 'Inventario', link: 'inventario' },
  ]);
}
