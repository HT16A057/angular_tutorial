import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MessageService } from './message.service';

// HTTPシンボルをインポート
import { HttpClient, HttpHeaders } from '@angular/common/http';

// 戻り地Observableにてエラーがあるかの確認用
import { catchError, map, tap } from 'rxjs/operators';

// put関数用にヘッダー情報を定義
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  

  getHeroes(): Observable<Hero[]> {
    // サーバーを経由せずにヒーローを取得する方法
    // this.messageService.add('HeroService: fetched heroes');
    // サーバーからヒーローを取得する方法
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /**
   * 失敗したHttp操作を処理する
   * アプリを持続させる
   * @param operation - 失敗した操作の名前
   * @param result - observableな結果として返す任意の値
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error);
      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed: ${error.message}`);
      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }

  /** IDによりヒーローを取得する。見つからない場合は404を返す */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

   // save()関数から呼び出されているupdateHero()にて変更を適用する
   // サーバー上でヒーローを更新
   updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** HeroServiceのメッセージをMessageServiceを使って記録 */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  // heroesUrlをサーバー上のヒーローリソースのアドレスで定義
  private heroesUrl = 'api/heroes'; // Web APIのURL

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  /** Post: サーバーに新しいヒーローを登録する */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** delete関数から呼び出される。ヒーローを削除する */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deletedHero'))
    );
  }

}
