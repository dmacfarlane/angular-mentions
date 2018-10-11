import { TemplateRef } from "@angular/core";
import { MentionListComponent } from './mention-list.component';

export interface MentionItem {

  // The list of items to be searched on.
  items: Array<{}>;

  // the character that will trigger the menu behavior
  triggerChar?: string;

  // option to specify the field in the objects to be used as the item label
  labelKey?: string;

  // option to limit the number of items shown in the pop-up menu
  maxItems?: number;

  // option to diable internal filtering. can be used to show the full list returned
  // from an async operation (or allows a custom filter function to be used - in future)
  disableSearch?: boolean;

  // template to use for rendering list items
  mentionListTemplate?: TemplateRef<any>;

  searchList? : MentionListComponent;

  mentionSelect? : any;
}