import {Component, ElementRef, Output, EventEmitter, ViewChild} from '@angular/core';

import { isInputOrTextAreaElement, getContentEditableCaretCoords } from './mention-utils';
import { getCaretCoordinates } from './caret-coords';

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular2-mentions
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
    <ul class="dropdown-menu scrollable-menu" #list [hidden]="hidden">
        <li *ngFor="let item of items; let i = index" [class.active]="activeIndex==i">
            <a class="text-primary" (mousedown)="activeIndex=i;itemClick.emit();$event.preventDefault()">{{item}}</a>
        </li>
    </ul>
    `
})
export class MentionListComponent {
  items = [];
  activeIndex:number = 0;
  hidden = false;
  @ViewChild('list') list : ElementRef;
  @Output() itemClick = new EventEmitter();
  constructor(private _element: ElementRef) {}

  position(nativeParentElement: HTMLInputElement, iframe: HTMLIFrameElement = null) {
    let coords = { top: 0, left: 0 };
    if (isInputOrTextAreaElement(nativeParentElement)) {
      coords = getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart);
      coords.top = nativeParentElement.offsetTop + coords.top + 16;
      coords.left = nativeParentElement.offsetLeft + coords.left;
    }
    else if (iframe) {
      let context: { iframe: HTMLIFrameElement, parent: Element } = { iframe: iframe, parent: iframe.offsetParent };
      coords = getContentEditableCaretCoords(context);
    }
    else {
      // lots of confusion here between relative coordinates and containers
      let doc = document.documentElement;
      let scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      let scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

      // bounding rectables are relative to view, offsets are relative to container?
      let caretRelativeToView = getContentEditableCaretCoords({ iframe: iframe });
      let parentRelativeToContainer: any = nativeParentElement.getBoundingClientRect();

      coords.top = caretRelativeToView.top - parentRelativeToContainer.y +
        nativeParentElement.offsetTop - scrollTop;
      coords.left = caretRelativeToView.left - parentRelativeToContainer.x +
        nativeParentElement.offsetLeft - scrollLeft;
    }
    let el: HTMLElement = this._element.nativeElement;
    el.style.position = "absolute";
    el.style.left = coords.left + 'px';
    el.style.top = coords.top + 'px';
  }
  get activeItem() {
    return this.items[this.activeIndex];
  }
  activateNextItem() {
    this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.items.length - 1), 0);
    this.list.nativeElement.scrollTop += this.getFirstLiOffset();
  }
  activatePreviousItem() {
    this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.items.length - 1), 0);
    this.list.nativeElement.scrollTop -= this.getFirstLiOffset();
  }

  getFirstLiOffset(): number {
    var firstLi: HTMLLIElement = this.list.nativeElement.getElementsByTagName('li').item(0);
    return !firstLi ? 0 : firstLi.offsetHeight;
  }

  resetScroll() {
    this.list.nativeElement.scrollTop = 0;
  }
}
