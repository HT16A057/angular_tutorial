import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
// import { HEROES } from '../mock-heroes';  // 複数のヒーローの追加
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // 使わなくなったから
  // hero: Hero = {
  //   id: 1,
  //   name: 'Windstorm'
  // };

  heroes: Hero[];  // 追加されたヒーローをバインディングするためにプロパティを追加
  
  // リストでクリックされた要素に対するイベントハンドラの定義
  // selectedHero: Hero;
  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  // }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

}
