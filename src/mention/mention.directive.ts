import { Directive, ElementRef, Input, ComponentFactoryResolver, ViewContainerRef, TemplateRef } from "@angular/core";
import { EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from "@angular/core";

import { MentionListComponent } from './mention-list.component';
import { getValue, insertValue, getCaretPosition, setCaretPosition } from './mention-utils';
import { MentionItem } from './mention-item';

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
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Copyright (c) 2017 Dan MacFarlane
 */
@Directive({
  selector: '[mentions]',
  host: {
    '(keydown)': 'keyHandler($event)',
    '(blur)': 'blurHandler($event)'
  }
})
export class MentionDirective implements OnInit, OnChanges {

  @Input() set mentions(mentionItems: Array<MentionItem>) {
    this.mentionItems = mentionItems;
  }

  // event emitted whenever the search term changes
  @Output() searchTerm = new EventEmitter();

  // Outputs on selected term
  @Output() selectedTerm = new EventEmitter();

  // the character that will trigger the menu behavior
  private defaultTriggerChar: string = "@";

  // option to specify the field in the objects to be used as the item label
  private defaultLabelKey: string = 'label';

  // option to diable internal filtering. can be used to show the full list returned
  // from an async operation (or allows a custom filter function to be used - in future)
  private defaultDisableSearch: boolean = false;

  // option to limit the number of items shown in the pop-up menu
  private defaultMaxItems: number = -1;

  // Function formatter
  private mentionSelect = function (item) { return this.lastMentionItem.triggerChar + this.lastMentionItem.searchList.activeItem[this.lastMentionItem.labelKey]; }; 

  searchString: string;
  startPos: number;
  mentionItems: Array<MentionItem>
  startNode;
  stopSearch: boolean;
  iframe: any; // optional
  keyCodeSpecified: boolean;
  lastMentionItem: MentionItem;

  constructor(
    private _element: ElementRef,
    private _componentResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef
  ) { }

  setMentionItemDefaults() {
    for (let mentionItem of this.mentionItems) {
      mentionItem.triggerChar = mentionItem.triggerChar || this.defaultTriggerChar;
      mentionItem.labelKey = mentionItem.labelKey || this.defaultLabelKey;
      mentionItem.disableSearch = mentionItem.disableSearch || this.defaultDisableSearch;
      mentionItem.maxItems = mentionItem.maxItems || this.defaultMaxItems;
      mentionItem.mentionSelect = mentionItem.mentionSelect || this.mentionSelect;
    }
  }

  convertStringsToObjects() {
    for (let mentionItem of this.mentionItems) {
      if (typeof mentionItem.items[0] == 'string') {
        mentionItem.items = mentionItem.items.map((label) => {
          let object = {};
          object[mentionItem.labelKey] = label;
          return object;
        });
      }

      // remove items without an labelKey (as it's required to filter the list)
      mentionItem.items = mentionItem.items.filter(e => e[mentionItem.labelKey]);
      mentionItem.items.sort((a, b) => a[mentionItem.labelKey].localeCompare(b[mentionItem.labelKey]));
    }
  }

  ngOnInit() {
    this.setMentionItemDefaults();
    this.convertStringsToObjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mentions']) {
      this.ngOnInit();
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
    if (this.lastMentionItem && this.lastMentionItem.searchList) {
      this.lastMentionItem.searchList.hidden = true;
    }
  }

  keyHandler(event: any, nativeElement: HTMLInputElement = this._element.nativeElement) {
    let val: string = getValue(nativeElement);
    let pos = getCaretPosition(nativeElement, this.iframe);
    let charPressed = this.keyCodeSpecified ? event.keyCode : event.key;
    if (!charPressed) {
      let charCode = event.which || event.keyCode;
      if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
        charPressed = String.fromCharCode(charCode + 32);
      }
      // TODO wut?
      // else if (event.shiftKey && charCode === KEY_2) {
      //   charPressed = this.triggerChar;
      // }
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
    // console.log("keyHandler", this.startPos, pos, val, charPressed, event);

    let mentionItem: MentionItem = this.getMentionItemFromCharPressed(charPressed);
    if (mentionItem) {
      this.lastMentionItem = mentionItem;

      // if (charPressed == this.triggerChar) {
      this.startPos = pos;
      this.startNode = (this.iframe ? this.iframe.contentWindow.getSelection() : window.getSelection()).anchorNode;
      this.stopSearch = false;
      this.searchString = null;
      this.showSearchList(mentionItem, nativeElement);
      this.updateSearchList(mentionItem);
    }
    else if (this.startPos >= 0 && !this.stopSearch) {
      if (pos <= this.startPos) {
        this.lastMentionItem.searchList.hidden = true;
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
          pos--;
          if (pos == 0) {
            this.stopSearch = true;
          }
          this.lastMentionItem.searchList.hidden = this.stopSearch;
        }
        else if (!this.lastMentionItem.searchList.hidden) {
          if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
            this.stopEvent(event);
            this.lastMentionItem.searchList.hidden = true;
            // value is inserted without a trailing space for consistency
            // between element types (div and iframe do not preserve the space)
            insertValue(nativeElement, this.startPos, pos, this.mentionSelect(this.lastMentionItem.searchList.activeItem), this.iframe);

            this.selectedTerm.emit(this.lastMentionItem.searchList.activeItem);
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
            this.lastMentionItem.searchList.hidden = true;
            this.stopSearch = true;
            return false;
          }
          else if (event.keyCode === KEY_DOWN) {
            this.stopEvent(event);
            this.lastMentionItem.searchList.activateNextItem();
            return false;
          }
          else if (event.keyCode === KEY_UP) {
            this.stopEvent(event);
            this.lastMentionItem.searchList.activatePreviousItem();
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
          this.updateSearchList(this.lastMentionItem);
        }
      }
    }
  }

  getMentionItemFromCharPressed(charPressed) {
    for (let mentionItem of this.mentionItems) {
      if (charPressed == mentionItem.triggerChar) {
        return mentionItem;
      }
    }
    return null;
  }

  updateSearchList(mentionItem: MentionItem) {
    let matches: any[] = [];
    if (mentionItem.items) {
      let objects = mentionItem.items;
      // disabling the search relies on the async operation to do the filtering
      if (!mentionItem.disableSearch && this.searchString) {
        let searchStringLowerCase = this.searchString.toLowerCase();
        objects = mentionItem.items.filter(e => e[mentionItem.labelKey].toLowerCase().startsWith(searchStringLowerCase));
      }
      matches = objects;
      if (mentionItem.maxItems > 0) {
        matches = matches.slice(0, mentionItem.maxItems);
      }
    }
    // update the search list
    if (mentionItem.searchList) {
      mentionItem.searchList.items = matches;
      mentionItem.searchList.hidden = matches.length == 0;
    }
  }

  showSearchList(mentionItem: MentionItem, nativeElement: HTMLInputElement) {
    if (mentionItem.searchList == null) {
      let componentFactory = this._componentResolver.resolveComponentFactory(MentionListComponent);
      let componentRef = this._viewContainerRef.createComponent(componentFactory);
      mentionItem.searchList = componentRef.instance;
      mentionItem.searchList.position(nativeElement, this.iframe);
      mentionItem.searchList.itemTemplate = mentionItem.mentionListTemplate;
      mentionItem.searchList.labelKey = mentionItem.labelKey;
      componentRef.instance['itemClick'].subscribe(() => {
        nativeElement.focus();
        let fakeKeydown = { "keyCode": KEY_ENTER, "wasClick": true };
        this.keyHandler(fakeKeydown, nativeElement);
      });
    }
    else {
      mentionItem.searchList.activeIndex = 0;
      mentionItem.searchList.position(nativeElement, this.iframe);
      window.setTimeout(() => mentionItem.searchList.resetScroll());
    }
  }
}
