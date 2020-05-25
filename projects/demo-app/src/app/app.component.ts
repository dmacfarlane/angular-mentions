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
  test = this.getPath();
  private getPath() {
    // the path provides direct access to the tests for e2e testing
    switch (window.location.pathname) {
      case '/config'   : return 'config';
      case '/events'   : return 'events';
      case '/async'    : return 'async';
      case '/options'  : return 'options';
      case '/templates': return 'templates';
      case '/pos'      : return 'pos';
      default          : return null;
    }
  }
}
