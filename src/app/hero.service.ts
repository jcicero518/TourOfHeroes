import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Hero } from './hero';
import { HEROES } from './mock-heroes'; // replaced by InMemoryDataService getDb()
import { MessageService } from './message.service';

// some HTTP symbols
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor( private http: HttpClient, private messageService: MessageService ) { }
  // getHeroes(): Hero[] {
  //  return HEROES;
  // }

  private heroesUrl = 'api/heroes';

  /**
   * Log a HeroService message with the MessageService
   * Abstraction to be used with tap or just this.log( message )
   *
   * @param {string} message
   */
  private log( message: string ) {
    this.messageService.add( message );
  }

  /**
   *
   * @param {string} operation
   * @param {T} result
   * @returns {(error: any) => Observable<T>}
   */
  private handleError<T>( operation = 'operation', result?: T ) {
    return ( error: any ): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of( result as T );
    };
  }

  // getHeroes(): Observable<Hero[]> {
    // this.messageService.add( 'HeroService: Fetched heroes' );
    // return of( HEROES ); // uses data from mock-heroes
  // }

  /**
   * Get heroes from mock server hooked up to HttpClient
   *
   * @returns {Observable<Hero[]>}
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>( this.heroesUrl )
      .pipe(
        tap( heroes => this.log( 'Fetched Heroes with tap' ) ),
        catchError( this.handleError( 'getHeroes', [] ) )
      );
  }

  searchHeroes( term: string ): Observable<Hero[]> {
    if ( ! term.trim() ) {
      // return empty hero array if no term
      return of( [] );
    }

    return this.http.get<Hero[]>( `${this.heroesUrl}/?name=${term}`).pipe(
      tap( _ => this.log( `Found heroes matching ${term}` ) ),
      catchError( this.handleError<Hero[]>( 'searchHeroes', [] ) )
    );
  }

  /**
   * Get an observable Hero object rather than an observable of hero arrays
   *
   * @param {number} id - hero id from route
   * @returns {Observable<Hero>}
   */
  getHero( id: number ): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`; // constructed request url

    return this.http.get<Hero>( url )
      .pipe(
        tap( _ => this.log( `Fetched hero ID=${id}` ) ),
        catchError( this.handleError<Hero>( `getHero id=${id}` ) )
      );
    // this.log( `HeroService: Fetched by ID: ${id}` );
    // return of( HEROES.find( hero => hero.id === id ) );
  }

  addHero( hero: Hero ): Observable<Hero> {
    return this.http.post<Hero>( this.heroesUrl, hero, httpOptions )
      .pipe(
        tap( ( hero: Hero ) => this.log( `Added hero name=${hero.name} with ID of ${hero.id}` ) ),
        catchError( this.handleError<Hero>( 'addHero' ) )
      );
  }

  updateHero( hero: Hero ): Observable<any> {
    return this.http.put( this.heroesUrl, hero, httpOptions )
      .pipe(
        tap( _ => this.log( `Updated hero ID=${hero.id}` ) ),
        catchError( this.handleError<any>( 'updateHero' ) )
      );
  }

  deleteHero( hero: Hero | number ): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>( url, httpOptions ).pipe(
      tap( _ => this.log( `Deleted hero ID of ${id}` ) ),
      catchError( this.handleError<Hero>( 'deleteHero' ) )
    );
  }
}
