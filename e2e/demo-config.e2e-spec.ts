import { element, by, protractor } from 'protractor';

import { AngularMentionsPage } from './app.po';

/**
 * Page is configured to test:
 *   - complex items using labelKey
 *   - format function
 *   - different trigger chars
 *   - updating configured items
 * 
 * Not tested:
 *   - combining mentions and mentions in config ? what behvaior is this?
 */

describe('angular-mentions demo-config', function() {
  var EC = protractor.ExpectedConditions;
  let page: AngularMentionsPage;

  beforeEach(() => {
    page = new AngularMentionsPage();
    page.navigateToDemoConfig();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    expect(page.getSubHeadingText()).toEqual('Configuration');
  })

  it('test mentions config', () => {
    let el = element.all(by.css('input')).first();

    el.getTagName().then(function(tagName){
      let menu = element(by.css('.dropdown-menu'));
      el.click();
      expect(page.getValue(el, tagName)).toEqual('');

      // basic mention
      el.sendKeys('Hello @Gav');
      expect(menu.isDisplayed()).toBe(true);
      expect(page.getValue(el, tagName)).toEqual('Hello @Gav');
      
      // select the mention
      el.sendKeys(protractor.Key.ENTER);
      expect(menu.isDisplayed()).toBe(false);
      expect(page.getValue(el, tagName)).toEqual('Hello @Gavin');

      // select another mention
      el.sendKeys(' and #');
      expect(element(by.css('.dropdown-menu li:nth-child(2) a')).getText()).toEqual('User 2');
      element(by.css('.dropdown-menu li:nth-child(3) a')).click();
      expect(page.getValue(el, tagName)).toEqual('Hello @Gavin and USER3');

      // press button to add a user, testing updates to the data
      element(by.buttonText('Add User')).click();
      el.click();
      el.sendKeys(' or #');
      expect(element(by.css('.dropdown-menu li:nth-child(4) a')).getText()).toEqual('User 4');
      element(by.css('.dropdown-menu li:nth-child(4) a')).click();
      expect(page.getValue(el, tagName)).toEqual('Hello @Gavin and USER3 or USER4');
    });  
  });
  
});
