import {
  //addEachProviders,
  inject
} from '@angular/core/testing';
import { AppComponent } from '../app/app.component';

describe('App: Ng2Mentions', () => {
  it('should create the app',
      inject([AppComponent], (app: AppComponent) => {
    expect(app).toBeTruthy();
  }));

  // it('should have as title \'ng2-mentions works!\'',
  //     inject([AppComponent], (app: AppComponent) => {
  //   expect(app.title).toEqual('ng2-mentions works!');
  // }));
});
