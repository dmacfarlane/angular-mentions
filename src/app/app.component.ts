import { Component } from '@angular/core';

import { Mention } from '../mention/mention';
import { COMMON_NAMES } from './common-names';
import { TinyMCE } from './tinymce.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    //styleUrls: ['app.component.css'],
    directives: [Mention, TinyMCE]
})
export class AppComponent {
  items:string [] = COMMON_NAMES;
}
