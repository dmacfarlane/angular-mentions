import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './demo-async/in-memory-data.service';

import { AppComponent } from './app.component';
import { MentionModule } from '../mention/mention.module';
import { DemoAsyncComponent } from './demo-async/demo-async.component';
import { DemoOptionsComponent } from './demo-options/demo-options.component';
import { DemoTemplateComponent } from './demo-template/demo-template.component';
import { DemoTinymceComponent } from './demo-tinymce/demo-tinymce.component';
import { DemoContenteditableComponent } from './demo-contenteditable/demo-contenteditable.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }),
    MentionModule
  ],
  declarations: [
    AppComponent,
    DemoAsyncComponent,
    DemoOptionsComponent,
    DemoTemplateComponent,
    DemoTinymceComponent,
    DemoContenteditableComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
