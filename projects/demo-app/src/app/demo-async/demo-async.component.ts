import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-demo-async',
  templateUrl: './demo-async.component.html'
})
export class DemoAsyncComponent implements OnInit {
  httpItems: Observable<any[]>;
  private searchTermStream = new Subject();
  ngOnInit() {
    this.httpItems = this.searchTermStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => this.getItems(term))
    );
  }
  search(term: string) {
    this.searchTermStream.next(term);
  }

  // this should be in a separate demo-async.service.ts file
  constructor(private http: HttpClient) { }
  getItems(term):Observable<any[]> {
    console.log('getItems:', term);
    if (!term) {
      // if the search term is empty, return an empty array
      return of([]);
    }
    // return this.http.get('api/names') // get all names
    return this.http.get<any[]>('api/objects?label='+term); // get filtered names
  }
}
