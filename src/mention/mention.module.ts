import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { Mention } from './mention';
import { MentionList } from './mention-list';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        Mention,
        MentionList
    ],
    entryComponents: [
        MentionList
    ],
    declarations: [
        Mention,
        MentionList
    ]
})
export class MentionModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MentionModule
        };
    }
}
