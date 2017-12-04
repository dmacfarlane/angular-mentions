import { browser, element, by } from 'protractor';

export class AngularMentionsPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeadingText() {
    return element(by.css('app-root h1')).getText();
  }
}
