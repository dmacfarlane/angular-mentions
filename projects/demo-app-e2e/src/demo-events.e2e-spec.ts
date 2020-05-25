import { element, by, protractor, browser, ElementFinder } from 'protractor';

import { AngularMentionsPage } from './app.po';
import { DemoEventsPage } from './demo-events.po';

describe('angular-mentions events', function() {
  let appPage: AngularMentionsPage;
  let demoPage: DemoEventsPage;
  let input: ElementFinder;

  beforeEach(() => {
    appPage = new AngularMentionsPage();
    demoPage = new DemoEventsPage();
    demoPage.navigateTo();
    expect(appPage.getHeadingText()).toEqual('Angular Mentions');
    expect(appPage.getSubHeadingText()).toEqual('Events');
    input = element.all(by.css('input')).first();
  })

  it('test basic events', () => {
    input.sendKeys('Hello @he', protractor.Key.ENTER);
    validateEvents([
      'Ready...',
      'opened',
      'searchTerm "h"',
      'searchTerm "he"',
      'itemSelected {"label":"Henry"}',
      'closed'
    ]);
  });

  it('test returnTrigger option', () => {
    const checkbox = element.all(by.css("input[type='checkbox']"));
    checkbox.click();
    expect(checkbox.isSelected()).toBeTruthy();
    input.sendKeys('Hello @bl', protractor.Key.ENTER);
    validateEvents([
      'Ready...',
      'opened',
      'searchTerm "@"',
      'searchTerm "@b"',
      'searchTerm "@bl"',
      'itemSelected {"label":"Blake"}',
      'closed'
    ]);
  });

  it('test closed event on blur', () => {
    const heading = element.all(by.css('h3'));
    // no event before opened
    input.click();
    heading.click();
    validateEvents([
      'Ready...'
    ]);
    // check blur after list opened
    input.sendKeys('Hello @he');
    heading.click();
    validateEvents([
      'Ready...',
      'opened',
      'searchTerm "h"',
      'searchTerm "he"',
      'closed'
    ]);
  });

  it('test closed event when no mentions', () => {
    input.sendKeys('Hello @hex');
    validateEvents([
      'Ready...',
      'opened',
      'searchTerm "h"',
      'searchTerm "he"',
      'searchTerm "hex"',
      // 'closed' // should 'closed' be emitted when no items?
    ]);
  });

  it('test searchTerm ignore special keys', () => {
    input.sendKeys('Hello @hx', protractor.Key.F10, protractor.Key.BACK_SPACE);
    validateEvents([
      'Ready...',
      'opened',
      'searchTerm "h"',
      'searchTerm "hx"', // f10 is ignored
      'searchTerm "h"' // after back_space
    ]);
  });

  function validateEvents(expectedLines:string[]) {
    let textPromise = demoPage.getOutputText();
    return textPromise.then( (text:string) => {
      let gotLines = text.split('\n').reverse().map(s=>s.substring(25)); // remove the timestamps
      expect(expectedLines).toEqual(gotLines);
    });
  }

});
