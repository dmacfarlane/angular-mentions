import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MentionModule } from '../mention/mention.module';
import { TinyMCEComponent } from './tinymce.component';

@NgModule({
  imports: [
    BrowserModule,
    MentionModule
  ],
  declarations: [
    AppComponent,
    TinyMCEComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
