import { Component, ElementRef, NgZone, Input, ViewChild } from '@angular/core';

import { MentionDirective } from 'angular-mentions';
import { COMMON_NAMES } from '../common-names';

declare var tinymce: any;

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Example usage with TinyMCE.
 */
@Component({
  selector: 'app-demo-tinymce',
  template: `
    <div class="form-group" style="position:relative">
      <div [mention]="items"></div>
      <div>
        <textarea class="hidden" cols="60" rows="4" id="tmce">{{htmlContent}}</textarea>
      </div>
    </div>`
})
export class DemoTinymceComponent {
  @Input() htmlContent:string;
  @ViewChild(MentionDirective, { static: true }) mention: MentionDirective;
  public items:string[] = COMMON_NAMES;
  constructor(private _elementRef: ElementRef, private _zone: NgZone) {}
  ngAfterViewInit() {
    tinymce.init({
      mode: 'exact',
      height: 100,
      theme: 'modern',
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code'
      ],
      toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      elements: "tmce",
      setup: this.tinySetup.bind(this)
    }
    );
  }
  tinySetup(ed) {
    ed.on('init', (args) => {
      this.mention.setIframe(ed.iframeElement);
    });
    ed.on('keydown', (e) => {
      let frame = <any>window.frames[ed.iframeElement.id];
      let contentEditable = frame.contentDocument.getElementById('tinymce');
      this._zone.run(() => {
        this.mention.keyHandler(e, contentEditable);
      });
    });
  }
}
