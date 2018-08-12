import { Component } from '@angular/core';

import { COMMON_NAMES } from './common-names';

/**
 * Demo app showing usage of the mentions directive.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  items: string[] = COMMON_NAMES;

  /**
   * Note: There is no way to add a trailing space after this span.
   * There will be useability consequences.
   */
  public insertSpanElement(name) {
    let el = document.createElement("span");
    el.contentEditable = "false";
    el.className = "mention";
    el.innerText = `@${name.label}`;
    return el;
  }

  /**
   * Note the trailig &nbsp;.
   * It helps with useability.
   */
  public insertSpanText(name) {
    return `
    <span
      class="mention"
      contenteditable="false"
      >@${name.label}</span>&nbsp;
    `;
  }
}
