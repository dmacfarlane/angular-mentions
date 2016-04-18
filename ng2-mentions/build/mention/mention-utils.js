System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function setValue(el, value) {
        if (isInputOrTextArea(el)) {
            el.value = value;
        }
        else {
            el.innerHTML = value + (value.endsWith(" ") ? "&nbsp;" : "");
        }
    }
    function getValue(el) {
        return isInputOrTextArea(el) ? el.value : el.textContent;
    }
    exports_1("getValue", getValue);
    function insertValue(el, start, end, text) {
        var val = getValue(el);
        setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
        setCaretPosition(el, start + text.length);
    }
    exports_1("insertValue", insertValue);
    function isInputOrTextArea(el) {
        return el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA';
    }
    exports_1("isInputOrTextArea", isInputOrTextArea);
    function getCaretPosition(el) {
        if (isInputOrTextArea(el)) {
            var val = el.value;
            return val.slice(0, el.selectionStart).length;
        }
        else {
            return getCaretCharacterOffsetWithin(el);
        }
    }
    exports_1("getCaretPosition", getCaretPosition);
    function setCaretPosition(el, pos) {
        if (isInputOrTextArea(el)) {
            if (el.createTextRange) {
                var range = el.createTextRange();
                range.move('character', pos);
                range.select();
            }
            else if (el.selectionStart) {
                el.focus();
                el.setSelectionRange(pos, pos);
            }
            else {
                el.focus();
            }
        }
        else {
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(el.firstChild, pos);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    exports_1("setCaretPosition", setCaretPosition);
    function getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        }
        else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }
    exports_1("getCaretCharacterOffsetWithin", getCaretCharacterOffsetWithin);
    function getSelectionCoords(win) {
        win = win || window;
        var doc = win.document;
        var sel = doc.selection, range, rects, rect;
        var x = 0, y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        }
        else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    x = rect.left;
                    y = rect.top;
                }
                if (x == 0 && y == 0) {
                    var span = doc.createElement("span");
                    if (span.getClientRects) {
                        span.appendChild(doc.createTextNode("\u200b"));
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                        var spanParent = span.parentNode;
                        spanParent.removeChild(span);
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x: x, y: y };
    }
    exports_1("getSelectionCoords", getSelectionCoords);
    return {
        setters:[],
        execute: function() {
            ;
        }
    }
});
