import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import { COMMON_NAMES } from './common-names';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  items: string[] = COMMON_NAMES;
  httpItems: Observable<string[]>;
  private searchTermStream = new Subject<string>();
  ngOnInit() {
    this.httpItems = this.searchTermStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((term: string) => this.getItems(term));
  }
  search(term: string) {
    this.searchTermStream.next(term);
  }

  // this should be in a separate app.service.ts file
  constructor(private http: Http) { }
  getItems(term): Promise<string[]> {
    console.log('getItems:', term);
    // return this.http.get('api/names') // get all names
    return this.http.get('api/objects?label='+term) // get filtered names
               .toPromise()
               .then(data => {console.log(data); return data})
               .then(response => response.json().data as string[])
               .catch(this.handleError);
  }
  handleError(e) {
    console.log(e);
  }
}
