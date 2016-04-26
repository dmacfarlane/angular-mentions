import {Component, ElementRef, NgZone, Input, ViewChild} from 'angular2/core';
import {Mention} from '../mention/mention';
import {COMMON_NAMES} from './common-names';

declare var tinymce: any;

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/ng2-mentions
 *
 * Example usage with TinyMCE.
 */
@Component({
    selector: 'tinymce',
    template: `
    <div class="form-group">
      <div [mention]="items" #mention></div>
      <div>
        <textarea class="hidden" cols="60" rows="4" id="tmce">{{htmlContent}}</textarea>
      </div>
    </div>`,
    directives: [Mention]
})
export class TinyMCE {
  @Input() htmlContent;
  @ViewChild('mention') mention;
  protected items:string [] = COMMON_NAMES;
  private zone:NgZone;
  constructor(private _elementRef: ElementRef) {
    this.zone = new NgZone({enableLongStackTrace: false});
  }
  ngAfterViewInit()
  {
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
    let comp = this;
    let mention = this.mention;
    ed.on('keydown', function(e) {
      let frame = <any>window.frames[ed.iframeElement.id];
      let contentEditable = frame.contentDocument.getElementById('tinymce');
      comp.zone.run(() => {
        comp.mention.keyHandler(e, contentEditable);
      });
    });
    ed.on('init', function(args) {
      mention.setIframe(ed.iframeElement);
    });
  }
}
