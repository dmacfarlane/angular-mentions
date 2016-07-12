import { Component, ElementRef, Output, EventEmitter } from '@angular/core';

import { isInputOrTextAreaElement, getContentEditableCaretCoords } from './mention-utils';
import { getCaretCoordinates } from './caret-coords';

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
        <li *ngFor="let item of items; let i = index" [class.active]="activeIndex==i">
            <a class="text-primary" (mousedown)="activeIndex=i;itemClick.emit();$event.preventDefault()">{{item}}</a>
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
    else if (iframe) {
      let context = {iframe:iframe,parent:iframe.offsetParent};
      coords = getContentEditableCaretCoords(context);
    }
    else {
      // lots of confusion here between relative coordinates and containers
      var doc = document.documentElement;
      var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      var scrollTop  = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

      // bounding rectables are relative to view, offsets are relative to container?
      let caretRelativeToView = getContentEditableCaretCoords({iframe:iframe});
      let parentRelativeToContainer = nativeParentElement.getBoundingClientRect();

      coords.top = caretRelativeToView.top - parentRelativeToContainer.y +
                   nativeParentElement.offsetTop - scrollTop;
      coords.left = caretRelativeToView.left - parentRelativeToContainer.x +
                    nativeParentElement.offsetLeft - scrollLeft;
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
