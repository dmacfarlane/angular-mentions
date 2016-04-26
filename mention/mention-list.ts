import {Component, ElementRef, Output, EventEmitter} from 'angular2/core';
import {isInputOrTextAreaElement, getContentEditableCaretCoords} from './mention-utils';
import {getCaretCoordinates} from './caret-coords';

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/ng2-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
@Component({
    selector: 'mention-list',
    styles: [`
      .scrollable-menu {
        display: block;
        height: auto;
        max-height: 300px;
        overflow: auto;
      }
    `,`
      [hidden] {
        display: none;
      }
    `],
    template: `
    <ul class="dropdown-menu scrollable-menu" [hidden]="hidden">
        <li *ngFor="#item of items; #i = index" [class.active]="activeIndex==i">
            <a class="text-primary" (click)="activeIndex=i;itemClick.emit()">{{item}}</a>
        </li>
    </ul>
    `
})
export class MentionList {
  items = [];
  activeIndex:number = 0;
  hidden = false;
  @Output() itemClick = new EventEmitter();
  constructor(private _element: ElementRef) {}
  position(nativeParentElement, iframe=null) {
    var coords = {top:0,left:0};
    if (isInputOrTextAreaElement(nativeParentElement)) {
      coords = getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart);
      coords.top = nativeParentElement.offsetTop + coords.top + 16;
      coords.left = nativeParentElement.offsetLeft + coords.left;
    }
    else {
      coords = getContentEditableCaretCoords(nativeParentElement, iframe);
    }
    this._element.nativeElement.style.position = "absolute";
    this._element.nativeElement.style.left = coords.left + 'px';
    this._element.nativeElement.style.top  = coords.top + 'px';
  }
  get activeItem() {
    return this.items[this.activeIndex];
  }
  activateNextItem(){
    this.activeIndex = Math.max(Math.min(this.activeIndex+1, this.items.length-1), 0);
  }
  activatePreviousItem(){
    this.activeIndex = Math.max(Math.min(this.activeIndex-1, this.items.length-1), 0);
  }
}
