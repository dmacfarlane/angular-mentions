import {Component, ElementRef, Output, EventEmitter} from 'angular2/core';
import {isInputOrTextArea, getSelectionCoords} from './mention-utils';

declare var getCaretCoordinates:any;

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
  position(nativeParentElement) {
    var coords = {top:0,left:0};
    if (isInputOrTextArea(nativeParentElement)) {
      coords = getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart);
      coords.top = nativeParentElement.offsetTop + coords.top;
      coords.left = nativeParentElement.offsetLeft + coords.left;
    }
    else {
      var doc = document.documentElement;
      var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      var scrollTop  = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
      var position = getSelectionCoords(window);
      coords = {top:position.y+scrollTop, left:position.x+scrollLeft};
    }
    this._element.nativeElement.style.position = "absolute";
    this._element.nativeElement.style.left = coords.left + 'px';
    this._element.nativeElement.style.top  = coords.top+16 + 'px';
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
