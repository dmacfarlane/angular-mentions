import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MentionModule } from '../mention/mention.module';
import { TinyMCE } from './tinymce.component';

@NgModule({
  imports: [
    BrowserModule,
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
