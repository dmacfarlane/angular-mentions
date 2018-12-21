import { element, by, protractor } from 'protractor';

import { AngularMentionsPage } from './app.po';

describe('angular-mentions app', function() {
  let page: AngularMentionsPage;

  beforeEach(() => {
    page = new AngularMentionsPage();
  })

  it('test mentions text field', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.css('input')).first();
    testMentions(el);
  });

  it('test mentions text area', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.css('textarea')).first();
    testMentions(el);
  });

  it('test mentions div', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.css('div')).first();
    testMentions(el);
  });

  it('test mentions iframe', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.id('tmce_ifr'));
    // iframe testing workaround - sendKeys is not working unless menu is opened first
    // this wasn't needed in previous versions of angular/protractor
    el.click();
    el.sendKeys('@');
    el.sendKeys(protractor.Key.BACK_SPACE);
    // end iframe testing workaround
    testMentions(el);
  });

  function testMentions(el){
    el.getTagName().then(function(tagName){
      let menu = element(by.css('.dropdown-menu'));
      el.click();
      expect(page.getValue(el, tagName)).toEqual('');

      // test for git issue #59
      el.sendKeys('@');
      expect(menu.isDisplayed()).toBe(true);
      el.sendKeys(protractor.Key.BACK_SPACE);
      expect(menu.isDisplayed()).toBe(false);
      el.sendKeys('xa');
      expect(menu.isDisplayed()).toBe(false);
      el.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
      expect(page.getValue(el, tagName)).toEqual('');

      // another variation of issue #59
      el.sendKeys('xx @');
      expect(menu.isDisplayed()).toBe(true);
      el.sendKeys(protractor.Key.BACK_SPACE);
      expect(menu.isDisplayed()).toBe(false);
      el.sendKeys('xa');
      expect(menu.isDisplayed()).toBe(false);
      // el.clear(); // clear does not work for tinymce
      el.sendKeys((new Array(6)).fill(protractor.Key.BACK_SPACE).join(''));
      expect(page.getValue(el, tagName)).toEqual('');

      // popup menu
      el.sendKeys('Hello @');
      expect(menu.isDisplayed()).toBe(true);
      expect(page.getValue(el, tagName)).toEqual('Hello @');
            
      // select mention using arrow keys and pressing enter
      // el.sendKeys(protractor.Key.ARROW_DOWN, protractor.Key.ENTER);

      // select mention by clicking mouse on second item in menu
      element(by.css('.dropdown-menu li:nth-child(2) a')).click();
      expect(menu.isDisplayed()).toBe(false);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron');
      
      // select another mention
      el.sendKeys(' and @gav', protractor.Key.ENTER);
      expect(menu.isDisplayed()).toBe(false);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin');
      
      // start another mention (with no values)
      el.sendKeys(' and @u');
      expect(menu.isDisplayed()).toBe(false);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @u');
      
      // remove the mention
      el.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and ');

      // start another mention
      el.sendKeys('@');
      expect(menu.isDisplayed()).toBe(true);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @');

      // continue the mention
      el.sendKeys('e');
      expect(menu.isDisplayed()).toBe(true);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @e');
      
      // but press escape instead
      el.sendKeys(protractor.Key.ESCAPE);
      expect(menu.isDisplayed()).toBe(false);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @e');
      
      // remove the escaped entry
      el.sendKeys('!!', protractor.Key.ARROW_LEFT, protractor.Key.ARROW_LEFT);
      el.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and !!');

      // and insert another mention
      el.sendKeys('@HE', protractor.Key.ENTER);
      expect(menu.isDisplayed()).toBe(false);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @Henry!!');
    });  
  }
  

});
