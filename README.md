# Angular 2 Mentions

Simple Angular 2 mentions inspired by [Ment.io](https://github.com/jeff-collins/ment.io).

[Click here for a Demo](http://dmacfarlane.github.io/angular2-mentions/)

Provides auto-complete suggestions for @mentions in text input fields, text areas,
and content editable fields. Not fully browser tested and comes without warranty!

To install and start the demo application:

    git clone https://github.com/dmacfarlane/angular2-mentions.git
    cd angular2-mentions
    npm install
    ng serve

### Usage

Add the package as a dependency to your project using:

    npm install --save angular2-mentions

Add the CSS to your index.html:

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

Add the module to your app.module imports:

    import { MentionModule } from 'angular2-mentions/mention';
    ...

    @NgModule({
        imports: [ MentionModule ],
        ...
    })

Add the `[mention]` directive to your input element:

    <input type="text" [mention]="items">

Where `items` is a string array of the items to suggest. For example:

    items: string[] = ["Noah", "Liam", "Mason", "Jacob", ...

#### Options

- `[mentionSelect]="formatter"` to specify a function to call when the user has picked an item in the menu.
- `[triggerChar]="@"` to specify the character that should trigger the menu behavior. The default value is '@'.


#### TODO:

- Improve npm package structure
- Improve menu positioning
- Configurable limit on number of items shown
- Load items via http service (configureable number of chars before search, and debounce requests)
