import {Directive, ElementRef, Input} from "angular2/core";
import {DynamicComponentLoader, ComponentRef} from "angular2/core";
import {MentionList} from './mention-list';
import {getValue, insertValue} from './mention-utils';
import {getCaretPosition, setCaretPosition} from './mention-utils';

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_SHIFT = 16;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_2 = 50;

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/ng2-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
@Directive({
  selector: '[mention]',
  host: {
    '(keydown)': 'keyHandler($event)',
  },
})
export class Mention {
  items: string [];
  startPos:number;
  startNode;
  searchList: MentionList;
  escapePressed:boolean;
  iframe:any; // optional
  constructor(private _element: ElementRef, private _dcl: DynamicComponentLoader) {}

  @Input() set mention(items:string []){
    this.items = items.sort();
  }

  setIframe(iframe) {
    this.iframe = iframe;
  }

  stopEvent(event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
  }

  keyHandler(event, nativeElement=this._element.nativeElement, wasClick=false) {
    let val = getValue(nativeElement);
    let pos = getCaretPosition(nativeElement, this.iframe);
    let charPressed = event.key;
    if (!charPressed) {
      let charCode = event.which || event.keyCode;
      if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
        charPressed = String.fromCharCode(charCode + 32);
      }
      else if (event.shiftKey && charCode === KEY_2) {
        charPressed = "@";
      }
      else {
        // TODO (dmacfarlane) fix this for non-alpha keys
        // http://stackoverflow.com/questions/2220196/how-to-decode-character-pressed-from-jquerys-keydowns-event-handler?lq=1
        charPressed = String.fromCharCode(event.which || event.keyCode);
      }
    }
    if (event.keyCode==13 && wasClick && pos<this.startPos) {
      // put caret back in position prior to contenteditable menu click
      pos = this.startNode.length;
      setCaretPosition(this.startNode, pos, this.iframe);
    }
    //console.log("keyHandler", this.startPos, pos, val, charPressed, event);
    if (charPressed=="@") {
      this.startPos = pos;
      this.startNode = (this.iframe ? this.iframe.contentWindow.getSelection() : window.getSelection()).anchorNode;
      this.escapePressed = false;
      this.showSearchList(nativeElement);
    }
    else if (this.startPos>=0 && !this.escapePressed) {
      if (event.keyCode!=KEY_SHIFT && pos>this.startPos) {
        if (event.keyCode === KEY_SPACE) {
          this.startPos = -1;
        }
        else if (event.keyCode === KEY_BACKSPACE && pos>0) {
          this.searchList.hidden = this.escapePressed;
          pos--;
        }
        else if (!this.searchList.hidden) {
          if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
            this.stopEvent(event);
            this.searchList.hidden = true;
            insertValue(nativeElement, this.startPos, pos,
                        "@"+this.searchList.activeItem+" ", this.iframe);
            // fire input event so angular bindings are updated
            if ("createEvent" in document) {
              var evt = document.createEvent("HTMLEvents");
              evt.initEvent("input", false, true);
              nativeElement.dispatchEvent(evt);
            }
            this.startPos = -1;
            return false;
          }
          else if (event.keyCode === KEY_ESCAPE) {
            this.stopEvent(event);
            this.searchList.hidden = true;
            this.escapePressed = true;
            return false;
          }
          else if (event.keyCode === KEY_DOWN) {
            this.stopEvent(event);
            this.searchList.activateNextItem();
            return false;
          }
          else if (event.keyCode === KEY_UP) {
            this.stopEvent(event);
            this.searchList.activatePreviousItem();
            return false;
          }
        }

        if (event.keyCode === KEY_LEFT || event.keyCode === KEY_RIGHT) {
          this.stopEvent(event);
          return false;
        }
        else {
          // update search
          let mention = val.substring(this.startPos, pos);
          if (event.keyCode !== KEY_BACKSPACE) {
            mention += charPressed;
          }
          let regEx = new RegExp("^"+mention.substring(1),"i");
          let matches = this.items.filter(e=>e.match(regEx)!=null);
          this.searchList.items = matches;
          this.searchList.hidden = matches.length==0 || pos<=this.startPos;
        }
      }
    }
  }

  showSearchList(nativeElement) {
    if (this.searchList==null) {
      this._dcl.loadNextToLocation(MentionList, this._element)
        .then((containerRef: ComponentRef) => {
          this.searchList = containerRef.instance;
          this.searchList.items = this.items;
          this.searchList.hidden = false;
          this.searchList.position(nativeElement, this.iframe);
          containerRef.instance['itemClick'].subscribe(ev => {
            nativeElement.focus();
              let fakeKeydown = new KeyboardEvent('keydown', <KeyboardEventInit>{"keyCode":KEY_ENTER});
              this.keyHandler(fakeKeydown, nativeElement, true);
          });
      });
    }
    else {
      this.searchList.activeIndex = 0;
      this.searchList.items = this.items;
      this.searchList.hidden = false;
      this.searchList.position(nativeElement, this.iframe);
    }
  }
}
