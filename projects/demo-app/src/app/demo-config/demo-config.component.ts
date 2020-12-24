import { Component } from '@angular/core';
import { COMMON_NAMES } from '../common-names';
import { MentionConfig } from 'angular-mentions';

@Component({
  selector: 'app-demo-config',
  templateUrl: './demo-config.component.html'
})
export class DemoConfigComponent {

  complexItems = [
    {
      "value" : "user1",
      "email": "user1@domain.com",
      "name": "User One"
    },
    {
      "value" : "user2",
      "email": "user2@domain.com",
      "name": "User Two"
    },
    {
      "value" : "user3",
      "email": "user3@domain.com",
      "name": "User Three"
    }
  ];

  format(item:any) {
    return item['value'].toUpperCase();
  }

  filter(searchString: string, items: any[]): any[] {
    return items.filter(item => item.name.toLowerCase().includes(searchString));
  }

  mentionConfig:MentionConfig = {
    mentions: [
      {
        items: this.complexItems,
        labelKey: 'name',
        triggerChar: '#',
        mentionSelect: this.format,
        mentionFilter: this.filter
      },
      {
        items: COMMON_NAMES,
        triggerChar: '@'
      }
    ]
  };

  addUser() {
    let next = this.complexItems.length+1;
    this.complexItems.push({
      "value" : "user"+next,
      "email": "user"+next+"@domain.com",
      "name": "User "+next
    });
    this.mentionConfig = Object.assign({}, this.mentionConfig);
  }
}
