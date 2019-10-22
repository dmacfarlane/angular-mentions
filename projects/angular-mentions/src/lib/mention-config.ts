// configuration structure, backwards compatible with earlier versions

export interface Mentions {
  // an array of strings or objects to suggest
  items?: any[];

  // the character that will trigger the menu behavior
  triggerChar?: string;

  // option to specify the field in the objects to be used as the item label
  labelKey?: string;

  // option to limit the number of items shown in the pop-up menu
  maxItems?: number;

  // option to disable sorting
  disableSort?: boolean;

  // option to diable internal filtering. can be used to show the full list returned
  // from an async operation (or allows a custom filter function to be used - in future)
  disableSearch?: boolean;

  // display menu above text instead of below
  dropUp?: boolean;

  // allow space while mentioning
  allowSpace?: boolean;

  // optional function to format the selected item before inserting the text
  mentionSelect?: (item: any) => (string);
}

export interface MentionConfig extends Mentions {
  // nested config
  mentions?: Mentions[];
}