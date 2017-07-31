import { Mentionable } from '../mention/mentionable';
import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
	httpItems: Observable<any[]>;
	private searchTermStream = new Subject();

	simpleItems: Mentionable[] = COMMON_NAMES.map(name => {
		return { value: name };
	});

	complexItems: Mentionable[] = COMMON_NAMES.map(name => {
		return { value: name, label: name.toLowerCase() };
	});

	// this should be in a separate app.service.ts file
	constructor(private http: Http) { }

	formatComplex(item: Mentionable) {
		return `[${item.label}]`;
	}

	ngOnInit() {
		this.httpItems = this.searchTermStream
			.debounceTime(300)
			.distinctUntilChanged()
			.switchMap((term: string) => this.getItems(term));
	}
	search(term: string) {
		this.searchTermStream.next(term);
	}

	getItems(term): Promise<any[]> {
		// return this.http.get('api/names') // get all names
		return this.http.get('api/objects?label=' + term) // get filtered names
			.toPromise()
			.then(data => { return data; })
			.then(response => response.json().data)
			.catch(this.handleError);
	}
	handleError(e) {
		console.log(e);
	}
}
