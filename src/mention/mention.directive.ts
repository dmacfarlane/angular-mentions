import { Directive, ElementRef, Input, ComponentFactoryResolver, ViewContainerRef, TemplateRef } from "@angular/core";
import { EventEmitter, Output } from "@angular/core";

import { MentionListComponent } from './mention-list.component';
import { getValue, insertValue, getCaretPosition, setCaretPosition } from './mention-utils';

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
 * https://github.com/dmacfarlane/angular2-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
@Directive({
  selector: '[mention]',
  host: {
    '(keydown)': 'keyHandler($event)',
    '(blur)': 'blurHandler($event)'
  }
})
export class MentionDirective {

  @Input() set mention(items:any[]){
    this.items = items;
  }

  @Input() set mentionConfig(config:any) {
    this.triggerChar = config.triggerChar || this.triggerChar;
    this.labelKey = config.labelKey || this.labelKey;
    this.disableSearch = config.disableSearch || this.disableSearch;
    this.maxItems = config.maxItems || this.maxItems;
    this.mentionSelect = config.mentionSelect || this.mentionSelect;
  }

  @Input() listTemplate: TemplateRef<any>;

  // event emitted whenever the search term changes
  @Output() searchTerm = new EventEmitter();

  // the character that will trigger the menu behavior
  private triggerChar: string = "@";

  // option to specify the field in the objects to be used as the item label
  private labelKey:string = 'label';

  // option to diable internal filtering. can be used to show the full list returned
  // from an async operation (or allows a custom filter function to be used - in future)
  private disableSearch:boolean = false;

  // option to limit the number of items shown in the pop-up menu
  private maxItems:number = -1;

  // optional function to format the selected item before inserting the text
  private mentionSelect: (item: any) => (string) = (item: any) => this.triggerChar + item[this.labelKey];

  searchString: string;
  startPos: number;
  items: any[];
  startNode;
  searchList: MentionListComponent;
  stopSearch: boolean;
  iframe: any; // optional

  constructor(
    private _element: ElementRef,
    private _componentResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    if (this.items && this.items.length>0) {
      if (typeof this.items[0] == 'string') {
        // convert strings to objects
        const me = this;
        this.items = this.items.map(function(label){
          let object = {};
          object[me.labelKey] = label;
          return object;
        });
      }
      // remove items without an labelKey or valueKey
      this.items = this.items.filter(e => e[this.labelKey]);
      this.items.sort((a,b)=>a[this.labelKey].localeCompare(b[this.labelKey]));
      this.updateSearchList();
    }
  }

  setIframe(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
  }

  stopEvent(event: any) {
    //if (event instanceof KeyboardEvent) { // does not work for iframe
    if (!event.wasClick) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  blurHandler(event: any) {
    this.stopEvent(event);
    this.stopSearch = true;
    if (this.searchList) {
      this.searchList.hidden = true;
    }
  }

  keyHandler(event: any, nativeElement: HTMLInputElement = this._element.nativeElement) {
    let val: string = getValue(nativeElement);
    let pos = getCaretPosition(nativeElement, this.iframe);
    let charPressed = event.key;
    if (!charPressed) {
      let charCode = event.which || event.keyCode;
      if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
        charPressed = String.fromCharCode(charCode + 32);
      }
      else if (event.shiftKey && charCode === KEY_2) {
        charPressed = this.triggerChar;
      }
      else {
        // TODO (dmacfarlane) fix this for non-alpha keys
        // http://stackoverflow.com/questions/2220196/how-to-decode-character-pressed-from-jquerys-keydowns-event-handler?lq=1
        charPressed = String.fromCharCode(event.which || event.keyCode);
      }
    }
    if (event.keyCode == KEY_ENTER && event.wasClick && pos < this.startPos) {
      // put caret back in position prior to contenteditable menu click
      pos = this.startNode.length;
      setCaretPosition(this.startNode, pos, this.iframe);
    }
    //console.log("keyHandler", this.startPos, pos, val, charPressed, event);
    if (charPressed == this.triggerChar) {
      this.startPos = pos;
      this.startNode = (this.iframe ? this.iframe.contentWindow.getSelection() : window.getSelection()).anchorNode;
      this.stopSearch = false;
      this.showSearchList(nativeElement);
      this.updateSearchList();
    }
    else if (this.startPos >= 0 && !this.stopSearch) {
      if (pos <= this.startPos) {
        this.searchList.hidden = true;
      }
      // ignore shift when pressed alone, but not when used with another key
      else if (event.keyCode !== KEY_SHIFT &&
          !event.metaKey &&
          !event.altKey &&
          !event.ctrlKey &&
          pos > this.startPos
      ) {
        if (event.keyCode === KEY_SPACE) {
          this.startPos = -1;
        }
        else if (event.keyCode === KEY_BACKSPACE && pos > 0) {
          this.searchList.hidden = this.stopSearch;
          pos--;
        }
        else if (!this.searchList.hidden) {
          if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
            this.stopEvent(event);
            this.searchList.hidden = true;
            // value is inserted without a trailing space for consistency
            // between element types (div and iframe do not preserve the space)
            insertValue(nativeElement, this.startPos, pos,
              this.mentionSelect(this.searchList.activeItem), this.iframe);
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
            this.stopSearch = true;
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
          let mention = val.substring(this.startPos + 1, pos);
          if (event.keyCode !== KEY_BACKSPACE) {
            mention += charPressed;
          }
          this.searchString = mention;
          this.searchTerm.emit(this.searchString);
          this.updateSearchList();
        }
      }
    }
  }

  updateSearchList() {
    let matches: any[] = [];
    if (this.items) {
      let objects = this.items;
      // disabling the search relies on the async operation to do the filtering
      if (!this.disableSearch && this.searchString) {
        let searchStringLowerCase = this.searchString.toLowerCase();
        objects = this.items.filter(e => e[this.labelKey].toLowerCase().startsWith(searchStringLowerCase));
      }
      matches = objects;
      if (this.maxItems > 0) {
        matches = matches.slice(0, this.maxItems);
      }
    }
    // update the search list
    if (this.searchList) {
      this.searchList.items = matches;
      this.searchList.hidden = matches.length == 0;
    }
  }

  showSearchList(nativeElement: HTMLInputElement) {
    if (this.searchList == null) {
      let componentFactory = this._componentResolver.resolveComponentFactory(MentionListComponent);
      let componentRef = this._viewContainerRef.createComponent(componentFactory);
      this.searchList = componentRef.instance;
      this.searchList.position(nativeElement, this.iframe);
      this.searchList.listTemplate = this.listTemplate;
      this.searchList.labelKey = this.labelKey;
      componentRef.instance['itemClick'].subscribe(() => {
        nativeElement.focus();
        let fakeKeydown = {"keyCode":KEY_ENTER,"wasClick":true};
        this.keyHandler(fakeKeydown, nativeElement);
      });
    }
    else {
      this.searchList.activeIndex = 0;
      this.searchList.position(nativeElement, this.iframe);
      window.setTimeout(() => this.searchList.resetScroll());
    }
  }
}
