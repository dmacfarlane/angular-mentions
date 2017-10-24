import {Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'app-demo-contenteditable',
  templateUrl: './demo-contenteditable.component.html'
})
export class DemoContenteditableComponent {
  @Input() items: any[];
  @ViewChild('input') el: ElementRef;

  constructor() { }

  formatItem = (item) => {
      // setTimeout(() => {
      //     const text = this.el.nativeElement.textContent;
      //     this.el.nativeElement.innerHTML = text;
      // }, 100);

    return `<em>${item.label}</em>`;
  }
}
