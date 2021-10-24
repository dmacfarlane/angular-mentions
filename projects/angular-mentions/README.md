# Angular Mentions

Simple Angular mentions inspired by [Ment.io](https://github.com/jeff-collins/ment.io).

[Click here for a Demo](http://dmacfarlane.github.io/angular-mentions/)

Provides auto-complete suggestions for @mentions in text input fields, text areas,
and content editable fields.

To install and start the demo application:

    git clone https://github.com/dmacfarlane/angular-mentions.git
    cd angular-mentions
    npm install
    ng serve

### Usage

Add the package as a dependency to your project using:

    npm install angular-mentions

Add the module to your app.module imports:

```typescript
import { MentionModule } from 'angular-mentions';
...

@NgModule({
    imports: [ MentionModule ],
    ...
})
```

Add the `[mention]` directive to your input element:

```html
<input type="text" [mention]="items">
```

Where `items` is a string array of the items to suggest. For example:

```typescript
items: string[] = ["Noah", "Liam", "Mason", "Jacob", ...
```

#### Configuration Options

The following optional configuration items can be used.

| Option        | Default  | Description |
| ---           | ---      | ---         |
| items         |          | An array of strings or objects to suggest. |
| triggerChar   | @        | The character that will trigger the menu behavior. |
| labelKey      | label    | The field to be used as the item label (when the items are objects). |
| disableSort   | false    | Disable sorting of suggested items. |
| disableSearch | false    | Disable internal filtering (only useful if async search is used). |
| dropUp        | false    | Show the menu above the cursor instead of below. |
| maxItems      | ∞        | Limit the number of items shown in the text. The default is no limit. |
| mentionSelect |          | A function to format the selected item before inserting the text. |
| allowSpace    | false    | Allow spaces while mentioning. |
| returnTrigger | false    | Include the trigger char in the searchTerm event. |

For Example: 

```html
<input type="text" [mention]="items" [mentionConfig]="{triggerChar:'#',maxItems:10,labelKey:'name'}">
```

#### Output Events

The following output events can be used.

| Output        | Description |
| ---           | ---         |
| `@Output() searchTerm EventEmitter<string>` | Event that is emitted whenever the search term changes. Can be used to trigger async search.
| `@Output() opened EventEmitter<void>`  | Event that is emitted when the mentions panel is opened.
| `@Output() closed EventEmitter<void>`  | Event that is emitted when the mentions panel is closed.

### Alternative Usage

The component can also be used by only specifying the mentionConfig object:

```html
<input type="text" [mentionConfig]="mentionConfig">
```

With the following structure:

```javascript
let mentionConfig = {
    items: [ "Noah", "Liam", "Mason", "Jacob", ... ],
    triggerChar: "@",
    ...
}
```

In this way, multiple config objects can be used:

```javascript
let mentionConfig = {
    mentions: [
        {
            items: [ "Noah", "Liam", "Mason", "Jacob", ... ],
            triggerChar: '@'
        },
        {
            items: [ "Red", "Yellow", "Green", ... ],
            triggerChar: '#'
        },
    }]
}
```
This allows different lists and trigger characters to be configured.

Note that becuase objects are mutable, changes to the items within the config will not be picked up unless a new mentionConfig object is created.
