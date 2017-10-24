import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-demo-contenteditable',
  templateUrl: './demo-contenteditable.component.html'
})
export class DemoContenteditableComponent {
  @Input() items: any[];

  formatItem(item) {
    return `<em>${item.label}</em>`;
  }
}
