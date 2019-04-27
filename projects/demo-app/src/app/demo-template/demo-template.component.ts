import { Component } from '@angular/core';

import { COMMON_NAMES } from '../common-names';

@Component({
  selector: 'app-demo-template',
  templateUrl: './demo-template.component.html'
})
export class DemoTemplateComponent {

  format = (item: any) => {
    return `[${item.username}]`;
  }

  complexItems: any[] = COMMON_NAMES.map(name => {
    return {label: name, username: name.toLowerCase()};
  });
}
