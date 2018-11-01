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
  items: string[] = COMMON_NAMES;
  get test() {
    switch (window.location.pathname) {
      case '/config'  : return 'config';
      case '/async'   : return 'async';
      case '/options' : return 'options';
      case '/async'   : return 'template';
    }
  }
}
