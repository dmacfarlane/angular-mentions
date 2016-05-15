import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Ng2MentionsAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(Ng2MentionsAppComponent);
