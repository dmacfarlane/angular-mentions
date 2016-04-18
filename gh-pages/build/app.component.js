System.register(['angular2/core', './mention/mention', './common-names'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, mention_1, common_names_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (mention_1_1) {
                mention_1 = mention_1_1;
            },
            function (common_names_1_1) {
                common_names_1 = common_names_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.items = common_names_1.COMMON_NAMES;
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n    <h1>Angular 2 Mentions</h1>\n    <p>Simple Angular2 mentions inspired by <a href=\"http://jeff-collins.github.io/ment.io/#/\">Ment.io</a>.</p>\n    <p style=\"color:grey\">Supports auto-complete for mentions in text input fields, text areas,\n    and content editable fields. Not browser tested and no warranty! Try entering some @names below.</p>\n    <h3>Minimal</h3>\n    <input [mention]=\"items\" class=\"form-control\" type=\"text\">\n    <h3>Textarea</h3>\n    <textarea [mention]=\"items\" class=\"form-control\" cols=\"60\" rows=\"4\"></textarea>\n    <h3>Content Editable</h3>\n    <div [mention]=\"items\" contenteditable=\"true\" style=\"border:1px lightgrey solid;min-height:88px\"></div>\n    <br><p style=\"color:grey\">n2g-mentions on <a href=\"\">Github</a></p>\n    <a href=\"https://github.com/dmacfarlane/ng2-mentions\"><img style=\"position: absolute; top: 0; right: 0; border: 0;\" src=\"https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67\" alt=\"Fork me on GitHub\" data-canonical-src=\"https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png\"></a>\n    ",
                        directives: [mention_1.Mention]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
