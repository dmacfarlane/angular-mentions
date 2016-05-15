import { Component } from '@angular/core';

import { Mention } from '../mention/mention';
import { COMMON_NAMES } from './common-names';
import { TinyMCE } from './tinymce.component';

@Component({
    moduleId: module.id,
    selector: 'ng2-mentions-app',
    templateUrl: 'ng2-mentions.component.html',
    //styleUrls: ['ng2-mentions.component.css'],
    directives: [Mention, TinyMCE]
})
export class Ng2MentionsAppComponent {
  items:string [] = COMMON_NAMES;
}
