import { Component, ElementRef, NgZone, Input, ViewChild } from '@angular/core';

import { MentionDirective } from '../mention/mention.directive';
import { COMMON_NAMES } from './common-names';
import { Mentionable } from '../mention/mentionable';

import * as tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/code';

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular2-mentions
 *
 * Example usage with TinyMCE.
 */

@Component({
	selector: 'tinymce',
	template: `
	<ng-template #simpleListTemplate let-item="item">
		{{item.value}}
	</ng-template>
	<div class="form-group" style="position:relative">
		<div [mention]="items" [listTemplate]="simpleListTemplate"></div>
		<div>
  		<textarea class="hidden" cols="60" rows="4" id="tmce">{{htmlContent}}</textarea>
    </div>
	</div>`
})
export class TinyMCE {
	@Input() htmlContent;
	@ViewChild(MentionDirective) mention: MentionDirective;
	protected items: Mentionable[] = COMMON_NAMES.map(name => {
		return { value: name };
	});
	constructor(private _elementRef: ElementRef, private _zone: NgZone) { }
	ngAfterViewInit() {
		tinymce.init({
			selector: "#tmce",
			height: 100,
			theme: 'modern',
			plugins: [
				'advlist autolink lists link image charmap print preview anchor',
				'searchreplace visualblocks code fullscreen',
				'insertdatetime media table contextmenu paste code'
			],
			skin_url: 'assets/tinymce/skins/lightgray',
			toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
			setup: this.tinySetup.bind(this)
		}
		);
	}
	tinySetup(ed) {
		let comp = this;
		let mention = this.mention;
		ed.on('keydown', function (e) {
			let frame = <any>window.frames[ed.iframeElement.id];
			let contentEditable = frame.contentDocument.getElementById('tinymce');
			comp._zone.run(() => {
				comp.mention.keyHandler(e, contentEditable);
			});
		});
		ed.on('init', function (args) {
			mention.setIframe(ed.iframeElement);
		});
	}
}
