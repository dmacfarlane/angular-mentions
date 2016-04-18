System.register(["angular2/core", './mention-list', './mention-utils'], function(exports_1, context_1) {
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
    var core_1, mention_list_1, mention_utils_1;
    var KEY_BACKSPACE, KEY_TAB, KEY_ENTER, KEY_SHIFT, KEY_ESCAPE, KEY_SPACE, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_2, Mention;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (mention_list_1_1) {
                mention_list_1 = mention_list_1_1;
            },
            function (mention_utils_1_1) {
                mention_utils_1 = mention_utils_1_1;
            }],
        execute: function() {
            KEY_BACKSPACE = 8;
            KEY_TAB = 9;
            KEY_ENTER = 13;
            KEY_SHIFT = 16;
            KEY_ESCAPE = 27;
            KEY_SPACE = 32;
            KEY_LEFT = 37;
            KEY_UP = 38;
            KEY_RIGHT = 39;
            KEY_DOWN = 40;
            KEY_2 = 50;
            Mention = (function () {
                function Mention(_element, _dcl) {
                    this._element = _element;
                    this._dcl = _dcl;
                }
                Object.defineProperty(Mention.prototype, "mention", {
                    set: function (items) {
                        this.items = items.sort();
                    },
                    enumerable: true,
                    configurable: true
                });
                Mention.prototype.keyHandler = function (event) {
                    var val = mention_utils_1.getValue(this._element.nativeElement);
                    var pos = mention_utils_1.getCaretPosition(this._element.nativeElement);
                    var charPressed = event.key;
                    if (!charPressed) {
                        var charCode = event.which || event.keyCode;
                        if (!event.shiftKey && (charCode >= 65 && charCode <= 90)) {
                            charPressed = String.fromCharCode(charCode + 32);
                        }
                        else if (event.shiftKey && charCode === KEY_2) {
                            charPressed = "@";
                        }
                        else {
                            charPressed = String.fromCharCode(event.which || event.keyCode);
                        }
                    }
                    if (charPressed == "@") {
                        this.mentionStart = pos;
                        this.escapePressed = false;
                        this.showSeachList();
                    }
                    else if (this.mentionStart >= 0 && !this.escapePressed) {
                        if (event.keyCode != KEY_SHIFT && pos > this.mentionStart) {
                            if (event.keyCode === KEY_SPACE) {
                                this.mentionStart = -1;
                            }
                            else if (event.keyCode === KEY_TAB || event.keyCode === KEY_ENTER) {
                                this.stopEvent(event);
                                this.searchList.hidden = true;
                                mention_utils_1.insertValue(this._element.nativeElement, this.mentionStart, pos, "@" + this.searchList.activeItem + " ");
                                this.mentionStart = -1;
                                return false;
                            }
                            else if (event.keyCode === KEY_ESCAPE) {
                                this.stopEvent(event);
                                this.searchList.hidden = true;
                                this.escapePressed = true;
                                return false;
                            }
                            else if (event.keyCode === KEY_DOWN) {
                                this.stopEvent(event);
                                this.searchList.activateNextItem();
                                return false;
                            }
                            else if (event.keyCode === KEY_UP) {
                                this.stopEvent(event);
                                this.searchList.activatePreviousItem();
                                return false;
                            }
                            else if (event.keyCode === KEY_BACKSPACE && pos > 0) {
                                this.searchList.hidden = this.escapePressed;
                                pos--;
                            }
                            if (!this.searchList.hidden) {
                                if (event.keyCode === KEY_LEFT || event.keyCode === KEY_RIGHT) {
                                    this.stopEvent(event);
                                    return false;
                                }
                                else {
                                    var mention = val.substring(this.mentionStart, pos);
                                    if (event.keyCode !== KEY_BACKSPACE) {
                                        mention += charPressed;
                                    }
                                    var regEx_1 = new RegExp("^" + mention.substring(1), "i");
                                    var matches = this.items.filter(function (e) { return e.match(regEx_1) != null; });
                                    this.searchList.items = matches;
                                    this.searchList.hidden = matches.length == 0 || pos <= this.mentionStart;
                                }
                            }
                        }
                    }
                };
                Mention.prototype.stopEvent = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                };
                Mention.prototype.showSeachList = function () {
                    var _this = this;
                    if (this.searchList == null) {
                        this._dcl.loadNextToLocation(mention_list_1.MentionList, this._element, [])
                            .then(function (containerRef) {
                            _this.searchList = containerRef.instance;
                            _this.searchList.items = _this.items;
                            _this.searchList.hidden = false;
                            _this.searchList.position(_this._element.nativeElement);
                        });
                    }
                    else {
                        this.searchList.items = this.items;
                        this.searchList.hidden = false;
                        this.searchList.position(this._element.nativeElement);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], Mention.prototype, "mention", null);
                Mention = __decorate([
                    core_1.Component({
                        selector: '[mention]',
                        template: '',
                        host: {
                            '(keydown)': 'keyHandler($event)',
                        },
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader])
                ], Mention);
                return Mention;
            }());
            exports_1("Mention", Mention);
        }
    }
});
