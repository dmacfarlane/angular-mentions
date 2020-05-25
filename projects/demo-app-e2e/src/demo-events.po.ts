import { browser, element, by } from 'protractor';

export class DemoEventsPage {
  navigateTo() {
    return browser.get('/events');
  }

  getOutputText() {
    return element(by.css('pre#eventOutput')).getText();
  }
}
