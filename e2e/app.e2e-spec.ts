import { browser, element, by, protractor } from 'protractor';

import { Angular2MentionsPage } from './app.po';

describe('angular2-mentions App', function() {
  var EC = protractor.ExpectedConditions;
  let page: Angular2MentionsPage;

  beforeEach(() => {
    page = new Angular2MentionsPage();
  })

  let elements = 

  it('test mentions text field', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular 2 Mentions');
    let el = element(by.css('input'));
    testMentions(el);
  });

  it('test mentions text area', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular 2 Mentions');
    let el = element.all(by.css('textarea')).first();
    testMentions(el);
  });

  it('test mentions div', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular 2 Mentions');
    let el = element.all(by.css('div')).first();
    testMentions(el);
  });

  it('test mentions iframe', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular 2 Mentions');
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
      expect(getValue(el, tagName)).toEqual('');

      // popup menu
      el.sendKeys('Hello @');
      //browser.wait(EC.textToBePresentInElementValue(el, 'Hello @'), 1000);
      expect(menu.isDisplayed()).toBe(true);
      expect(getValue(el, tagName)).toEqual('Hello @');
            
      // select mention using arrow keys and pressing enter
      //el.sendKeys(protractor.Key.ARROW_DOWN, protractor.Key.ENTER);
      // select mention by clicking mouse on second item in menu
      element(by.css('.dropdown-menu li:nth-child(2) a')).click();
      expect(menu.isDisplayed()).toBe(false);
      expect(getValue(el, tagName)).toEqual('Hello @Aaron');
      
      // select another mention
      el.sendKeys(' and @gav', protractor.Key.ENTER);
      expect(menu.isDisplayed()).toBe(false);
      expect(getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin');
      
      // start another mention
      el.sendKeys(' and @e');
      expect(menu.isDisplayed()).toBe(true);
      expect(getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @e');
      
      // but press escape instead
      el.sendKeys(protractor.Key.ESCAPE);
      expect(menu.isDisplayed()).toBe(false);
      expect(getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @e');
      
      // remove the escaped entry
      el.sendKeys('!!', protractor.Key.ARROW_LEFT, protractor.Key.ARROW_LEFT);
      el.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
      expect(getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and !!');
      
      // and insert another mention
      el.sendKeys('@he', protractor.Key.ENTER);
      expect(menu.isDisplayed()).toBe(false);
      expect(getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @Henry!!');
    });  
  }
  
  function getValue(el, tagName) {
    if (tagName=="input" || tagName=="textarea") {    
      return el.getAttribute('value');
    }
    else if (tagName.length>0 && tagName[0]=='iframe') {
      let iframe = browser.findElement(by.tagName("iframe"));
      return browser.switchTo().frame(iframe).then( () => {
        let el = browser.driver.findElement(by.id('tinymce'));
        let text = el.getText();
        return browser.switchTo().defaultContent().then(()=>{
          return browser.waitForAngular().then(()=>{return text});
        });
      });              
    }
    else {
      return el.getText();
    }    
  }
});
