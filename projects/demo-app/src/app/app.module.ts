import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './demo-async/in-memory-data.service';

import { AppComponent } from './app.component';
import { MentionModule } from 'angular-mentions';
import { DemoAsyncComponent } from './demo-async/demo-async.component';
import { DemoConfigComponent } from './demo-config/demo-config.component';
import { DemoEventsComponent } from './demo-events/demo-events.component';
import { DemoOptionsComponent } from './demo-options/demo-options.component';
import { DemoTemplateComponent } from './demo-template/demo-template.component';
import { DemoTinymceComponent } from './demo-tinymce/demo-tinymce.component';
import { TestPositionComponent } from './test-position/test-position.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 500 }),
    MentionModule
  ],
  declarations: [
    AppComponent,
    DemoAsyncComponent,
    DemoConfigComponent,
    DemoEventsComponent,
    DemoOptionsComponent,
    DemoTemplateComponent,
    DemoTinymceComponent,
    TestPositionComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
