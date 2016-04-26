// DOM element manipulation functions...
//

function setValue(el, value) {
  //console.log("setValue", el.nodeName, value);
  if (isInputOrTextAreaElement(el))
  {
    el.value = value;
  }
  else {
    el.textContent = value;
  }
}

export function getValue(el) {
  return isInputOrTextAreaElement(el) ? el.value : el.textContent;
}

export function insertValue(el, start, end, text, iframe, noRecursion=false) {
  //console.log("insertValue", el.nodeName, start, end, text, el);
  if (isTextElement(el)) {
    var val = getValue(el);
    setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
    setCaretPosition(el, start+text.length, iframe);
  }
  else if (!noRecursion) {
    var selObj = getWindowSelection(iframe);
    var selRange = selObj.getRangeAt(0);
    var position = selRange.startOffset;
    var anchorNode = selObj.anchorNode;
    insertValue(anchorNode, position-(end-start), position, text, iframe, true);
  }
}

export function isInputOrTextAreaElement(el) {
  return el!=null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA');
};

export function isTextElement(el) {
  return el!=null && (el.nodeName == 'INPUT' || el.nodeName == 'TEXTAREA' || el.nodeName=='#text');
};

export function setCaretPosition(el, pos, iframe=null) {
  //console.log("setCaretPosition", pos, el, iframe==null);
  if(isInputOrTextAreaElement(el) && el.selectionStart) {
    el.focus();
    el.setSelectionRange(pos, pos);
  }
  else {
    let range = getDocument(iframe).createRange();
    range.setStart(el, pos);
    range.collapse(true);
    let sel = getWindowSelection(iframe);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export function getCaretPosition(el, iframe=null) {
  //console.log("getCaretPosition", el);
  if (isInputOrTextAreaElement(el)) {
    var val = el.value;
    return val.slice(0, el.selectionStart).length;
  }
  else {
    var selObj = getWindowSelection(iframe); //window.getSelection();
    var selRange = selObj.getRangeAt(0);
    var position = selRange.startOffset;
    return position;
  }
}

export function getContentEditableCaretCoords(nativeParentElement, iframe) {
  let ctx = iframe ? { iframe: iframe } : null;
  return getContentEditableCaretPositionMentIo(ctx);
}

// Based on ment.io functions...
//

function getDocument(iframe) {
    if (!iframe) {
        return document;
    } else {
        return iframe.contentWindow.document;
    }
}

function getWindowSelection(iframe) {
    if (!iframe) {
        return window.getSelection();
    } else {
        return iframe.contentWindow.getSelection();
    }
}

function getContentEditableCaretPositionMentIo(ctx/*, selectedNodePosition*/) {
    var markerTextChar = '\ufeff';
    var markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
    var doc = getDocument(ctx?ctx.iframe:null);
    var sel = getWindowSelection(ctx?ctx.iframe:null);
    var prevRange = sel.getRangeAt(0);

    // create new range and set postion using prevRange
    var range = doc.createRange();
    range.setStart(sel.anchorNode, prevRange.startOffset);
    range.setEnd(sel.anchorNode, prevRange.startOffset);
    range.collapse(false);

    // Create the marker element containing a single invisible character
    // using DOM methods and insert it at the position in the range
    var markerEl = doc.createElement('span');
    markerEl.id = markerId;
    markerEl.appendChild(doc.createTextNode(markerTextChar));
    range.insertNode(markerEl);
    sel.removeAllRanges();
    sel.addRange(prevRange);

    var coordinates = {
        left: 0,
        top: markerEl.offsetHeight
    };

    localToGlobalCoordinates(ctx, markerEl, coordinates);

    markerEl.parentNode.removeChild(markerEl);
    return coordinates;
}

function localToGlobalCoordinates(ctx, element, coordinates) {
    var obj = element;
    var iframe = ctx ? ctx.iframe : null;
    while(obj) {
        coordinates.left += obj.offsetLeft + obj.clientLeft;
        coordinates.top += obj.offsetTop + obj.clientTop;
        obj = obj.offsetParent;
        if (!obj && iframe) {
            obj = iframe;
            iframe = null;
        }
    }
    obj = element;
    iframe = ctx ? ctx.iframe : null;
    while(obj !== getDocument(null).body && obj!=null) {
        if (obj.scrollTop && obj.scrollTop > 0) {
            coordinates.top -= obj.scrollTop;
        }
        if (obj.scrollLeft && obj.scrollLeft > 0) {
            coordinates.left -= obj.scrollLeft;
        }
        obj = obj.parentNode;
        if (!obj && iframe) {
            obj = iframe;
            iframe = null;
        }
    }
 }
