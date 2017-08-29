import { Component } from '@angular/core';

import { COMMON_NAMES } from './common-names';


/**
 * Demo app showing usage of the mentions directive.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  simpleItems: any[] = COMMON_NAMES.map(name => {
    return {label: name};
  });

  complexItems: any[] = COMMON_NAMES.map(name => {
    return {label: name, username: name.toLowerCase()};
  });

  formatComplex = (item: any) => {
    return `[${item.username}]`;
  }
}
