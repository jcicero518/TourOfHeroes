import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  selectedHero: Hero;
  // heroes = HEROES;
  heroes: Hero[];

  constructor( private heroService: HeroService ) {
  }
  // let Angular call ngOnInit at an appropriate time after constructing a HeroesComponent instance.
  ngOnInit() {
    this.getHeroes();
  }

  /**
   * When name is not blank create a hero-like object with the name.
   * The addHero subscribe callback receives the new hero and pushes
   * it onto the heroes list for display (on success).
   *
   * @param {string} name
   */
  add( name: string ): void {
    name = name.trim();
    if ( ! name ) {
      return;
    }

    this.heroService.addHero( {name} as Hero )
      .subscribe( hero => this.heroes.push( hero ) );
  }

  delete( hero: Hero ): void {
    this.heroes = this.heroes.filter( h => h !== hero );
    // Nothing for the component to do with returned Observable, subscribe anyway to complete the delete operation
    this.heroService.deleteHero( hero ).subscribe();
  }

  getHeroes(): void {
    // this.heroes = this.heroService.getHeroes();
    // (async) waits for the Observable to emit the array of heroes - then subscribe passes the emitted array to
    // the callback, which sets the component's heroes property
    this.heroService.getHeroes()
      .subscribe( heroes => this.heroes = heroes );
  }

}
