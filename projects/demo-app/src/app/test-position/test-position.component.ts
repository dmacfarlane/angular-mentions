import { Component } from '@angular/core';

import { COMMON_NAMES } from '../common-names';

@Component({
  selector: 'app-test-position',
  templateUrl: './test-position.component.html'
})
export class TestPositionComponent {
  items: string[] = COMMON_NAMES;
  scrollValues(e:HTMLElement) {
    return ` 
      scrollLeft=${e.scrollLeft}; scrollWidth=${e.scrollWidth}
      scrollTop=${e.scrollTop}; scrollHeight=${e.scrollHeight}
    `;
  }
}
