# Angular 2 Mentions

Simple Angular 2 mentions inspired by [Ment.io](https://github.com/jeff-collins/ment.io).

[Click here for a Demo](http://dmacfarlane.github.io/ng2-mentions/)

Provides auto-complete for mentions in text input fields, text areas,
and content editable fields. Not fully browser tested and comes without warranty!

To install and start the demo application:

    npm install
    npm start

### Usage

Copy the mention folder into your own application.

Add the dependancies to your index.html:

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <script src="ext/textarea-caret-position.js"></script>

Add the `[mention]` directive to your input element:

    <input [mention]="items" class="form-control" type="text">

Where `items` is a string array of the items to suggest. For example:

    var items:string [] = = ["Noah","Liam","Mason","Jacob",...

#### TODO:

- Remove debug (always)
- Fix line-feed issue in content editable
- Iframe based (TinyMCE)
- Styled menu items
- Load items via http (config for number of chars before search)
- Configurable prefix
- Configurable limit on number of items shown via config
- Tests...
