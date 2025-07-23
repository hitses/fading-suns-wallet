import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { Character } from '../../interfaces/character';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private storeName = 'characters';

  private readonly dbService = inject(NgxIndexedDBService);

  addCharacter(character: Character): Observable<Character> {
    return from(this.dbService.add(this.storeName, character));
  }

  getAllCharacters(): Observable<Character[]> {
    return from(this.dbService.getAll(this.storeName)).pipe(
      map((result) => result as Character[]),
      catchError((error) => throwError(() => error.error)),
    );
  }

  getCharacterById(id: number): Observable<Character | undefined> {
    return from(this.dbService.getByKey(this.storeName, id)).pipe(
      map((result) => result as Character | undefined),
      catchError((error) => throwError(() => error.error)),
    );
  }

  getCharacterBySlug(slug: string | null): Observable<Character | undefined> {
    if (!slug) throw new Error('Slug is required for get operation.');

    return from(this.dbService.getByIndex(this.storeName, 'slug', slug)).pipe(
      map((result) => {
        if (!result) return undefined;

        return result as Character;
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  updateCharacter(character: Character): Observable<Character> {
    if (character.id === undefined)
      throw new Error('Character ID is required for update operation.');

    return from(this.dbService.update(this.storeName, character));
  }

  deleteCharacter(id: number): Observable<boolean[] | unknown[]> {
    return from(this.dbService.delete(this.storeName, id));
  }
}
