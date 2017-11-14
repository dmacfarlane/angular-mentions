import { Component } from '@angular/core';

// import { COMMON_NAMES } from './common-names';

/**
 * Demo app showing usage of the mentions directive.
 */
@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent {
  // items: string[] = COMMON_NAMES;

  items: any[] = [
    {
      label: 'Ab',
      avatar: 'https://t3.ftcdn.net/jpg/01/06/07/16/240_F_106071621_UwCztl7yyMbVNSMijfuYyZrzbtm' +
        'oxJPH.jpg'
    }, {
      label: 'Bc',
      avatar: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'
    }, {
      label: 'Cd',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_l' +
        'arge.png'
    }
  ];

  selectedItem(item) {
    console.log('item', item);
  }
}
