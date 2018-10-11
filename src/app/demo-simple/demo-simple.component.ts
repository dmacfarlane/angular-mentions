import { Component } from '@angular/core';
import { MentionItem } from '../../mention/mention-item';
import { COMMON_NAMES } from '../common-names';
import { COMMON_TAGS } from '../common-tags';

/**
 * Demo app showing usage of the mentions directive.
 */
@Component({
  selector: 'demo-simple',
  templateUrl: './demo-simple.component.html'
})
export class DemoSimpleComponent {

  mentionItems: Array<MentionItem> = [
    {
      items: COMMON_NAMES,
      triggerChar: '@',
    },
    {
      items: COMMON_TAGS,
      triggerChar: '#',
    },
    {
      items: [
        {
          id: 1,
          name: "community_A"
        },
        {
          id: 2,
          name: "community_B"
        }
      ],
      labelKey: "name",
      triggerChar: "~"
    }
  ];

  selectedTerm(item: any) {
    console.log(item);
  }
}
