import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MentionModule } from '../mention/mention.module';
import { TinyMCE } from './tinymce.component';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }),
    MentionModule
  ],
  declarations: [
    AppComponent,
    TinyMCE
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
