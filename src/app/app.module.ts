import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './demo-async/in-memory-data.service';

import { AppComponent } from './app.component';
import { MentionModule } from '../mention/mention.module';
import { DemoSimpleComponent } from './demo-simple/demo-simple.component';
import { DemoAsyncComponent } from './demo-async/demo-async.component';
import { DemoOptionsComponent } from './demo-options/demo-options.component';
import { DemoTemplateComponent } from './demo-template/demo-template.component';
import { DemoTinymceComponent } from './demo-tinymce/demo-tinymce.component';

const appRoutes: Routes = [
  // the main one
  { path: '', component: DemoSimpleComponent },
  { path: 'demo-async', component: DemoAsyncComponent },
  { path: 'demo-options', component: DemoOptionsComponent },
  { path: 'demo-template', component: DemoTemplateComponent },
  { path: 'demo-tinymce', component: DemoTinymceComponent },
];


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }),
    MentionModule,
    RouterModule.forRoot(
      appRoutes)
  ],
  declarations: [
    AppComponent,
    DemoSimpleComponent,
    DemoAsyncComponent,
    DemoOptionsComponent,
    DemoTemplateComponent,
    DemoTinymceComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
