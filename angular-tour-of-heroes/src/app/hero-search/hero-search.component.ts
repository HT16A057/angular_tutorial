import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // 検索後をobservableストリームにpushする
  search(term: string): void {
    this.searchTerms.next(term);
  }


  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // 各キーストロークのあと、検索前に300ms待つ
      debounceTime(300),

      // 直前の検索ごと同じ場合は無視する
      distinctUntilChanged(),

      // 検索後が変わるたびに新しい検索observableにスイッチする
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

}
