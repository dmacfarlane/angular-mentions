import { Component } from '@angular/core';
import { COMMON_NAMES } from '../common-names';
import { MentionConfig } from 'mention/mention-config';

@Component({
  selector: 'app-demo-config',
  templateUrl: './demo-config.component.html'
})
export class DemoConfigComponent {

  complexItems = [
    {
      "value" : "user1",
      "email": "user1@domain.com",
      "name": "User 1"
    },
    {
      "value" : "user2",
      "email": "user2@domain.com",
      "name": "User 2"
    },
    {
      "value" : "user3",
      "email": "user3@domain.com",
      "name": "User 3"
    }
  ];

  format(item:any) {
    return item['value'].toUpperCase();
  }

  mentionConfig:MentionConfig = {
    mentions: [
      {
        items: this.complexItems,
        labelKey: 'name',
        triggerChar: '#',
        mentionSelect: this.format
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
