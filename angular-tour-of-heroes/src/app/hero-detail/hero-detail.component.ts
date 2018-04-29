import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  // HTTPの章に入るまではgoBackを押しても変更が反映されていたが
  // in-memory-web-api-moduleを利用してからは、仮想のサーバーを相手にしているから
  // データが保存されずにもとの値が表示される。
  // その問題を解決するための関数を定義する
  save(): void {
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());  // 保存してから戻る
  }

 

}
