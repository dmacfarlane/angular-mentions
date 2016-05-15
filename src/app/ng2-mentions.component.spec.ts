import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { Ng2MentionsAppComponent } from '../app/ng2-mentions.component';

beforeEachProviders(() => [Ng2MentionsAppComponent]);

describe('App: Ng2Mentions', () => {
  it('should create the app',
      inject([Ng2MentionsAppComponent], (app: Ng2MentionsAppComponent) => {
    expect(app).toBeTruthy();
  }));

  // it('should have as title \'ng2-mentions works!\'',
  //     inject([Ng2MentionsAppComponent], (app: Ng2MentionsAppComponent) => {
  //   expect(app.title).toEqual('ng2-mentions works!');
  // }));
});
