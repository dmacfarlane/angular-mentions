# Angular 2 Mentions

Simple Angular 2 mentions inspired by [Ment.io](https://github.com/jeff-collins/ment.io).

[Click here for a Demo](http://dmacfarlane.github.io/angular2-mentions/)

Provides auto-complete for mentions in text input fields, text areas,
and content editable fields. Not fully browser tested and comes without warranty!

To install and start the demo application:

    git clone https://github.com/dmacfarlane/angular2-mentions.git
    cd angular2-mentions
    npm install
    ng serve

### Usage

Install the package as a dependency using:

    npm install --save angular2-mentions

Add the CSS to your index.html:

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

Add the module to your module imports:

    import { MentionModule } from 'angular2-mentions/mention/mention.module';

    @NgModule({
        imports: [ MentionModule ],
        ...
    })

Add the `[mention]` directive to your input element:

    <input [mention]="items" class="form-control" type="text">

Where `items` is a string array of the items to suggest. For example:

    var items:string [] = = ["Noah","Liam","Mason","Jacob",...

#### TODO:

- Remove debug (always)
- Improve NPM package structure
- Document configurable prefix
- Configurable limit on number of items shown via config
- Load items via http (config number of chars before search)
- Styled menu items
