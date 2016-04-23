// DOM element manipulation functions

function setValue(el, value) {
  if (isInputOrTextArea(el)) {
    el.value = value;
  }
  else {
    //el.textContent = value; //el.appendChild(document.createTextNode(value));
    el.innerHTML = value + (value.endsWith(" ") ? "&nbsp;" : "");
  }
}

export function getValue(el) {
  return isInputOrTextArea(el) ? el.value : el.textContent;
}

export function insertValue(el, start, end, text) {
  var val = getValue(el);
  setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
  setCaretPosition(el, start+text.length);
}

export function isInputOrTextArea(el) {
    return el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA';
};

export function getCaretPosition(el) {
  if (isInputOrTextArea(el)) {
    var val = el.value;
    return val.slice(0, el.selectionStart).length;
  }
  else {
    return getCaretCharacterOffsetWithin(el);
  }
}

export function setCaretPosition(el, pos) {
  if (isInputOrTextArea(el)) {
    // http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
    if(el.createTextRange) {
      let range = el.createTextRange();
      range.move('character', pos);
      range.select();
    }
    else if(el.selectionStart) {
      el.focus();
      el.setSelectionRange(pos, pos);
    }
    else {
      el.focus();
    }
  }
  else {
    // http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(el.firstChild, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

// http://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
export function getCaretCharacterOffsetWithin(element) {
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
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

// http://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
export function getSelectionCoords(win) {
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
    } else if (win.getSelection) {
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
            // Fall back to inserting a temporary element
            if (x == 0 && y == 0) {
                var span = doc.createElement("span");
                if (span.getClientRects) {
                    // Ensure span has dimensions and position by
                    // adding a zero-width space character
                    span.appendChild( doc.createTextNode("\u200b") );
                    range.insertNode(span);
                    rect = span.getClientRects()[0];
                    x = rect.left;
                    y = rect.top;
                    var spanParent = span.parentNode;
                    spanParent.removeChild(span);

                    // Glue any broken text nodes back together
                    spanParent.normalize();
                }
            }
        }
    }
    return { x: x, y: y };
}

/*
insertNodeAtCaret(el, start, end, text) {
    // var sel=window.getSelection();
    // if (sel.rangeCount) {
    //     var range = sel.getRangeAt(0);
    //     range.collapse(false);
    //     range.insertNode(node);
    //     range.collapseAfter(node);
    //     sel.setSingleRange(range);
    // }
    //var el = document.getElementById("editable");
    var range = document.createRange();
    var sel = window.getSelection();
    //var range = sel.getRangeAt(0);
    range.setStart(el.firstChild, start);
    range.setEnd(el.firstChild, end);
    range.deleteContents();
    //range.collapse(true);
    range.insertNode(document.createTextNode(text));
    sel.removeAllRanges();
    //sel.addRange(range);
}*/
