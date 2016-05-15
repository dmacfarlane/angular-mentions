export class Ng2MentionsPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeadingText() {
    return element(by.css('ng2-mentions-app h1')).getText();
  }
}
