// DOM element manipulation functions...
//

function setValue(el: HTMLInputElement, value: any) {
  // console.log("setValue", el.nodeName, "["+value+"]");
  if (isInputOrTextAreaElement(el)) {
    el.value = value;
  } else {
    el.textContent = value;
  }
}

export function getValue(el: HTMLInputElement) {
  return isInputOrTextAreaElement(el) ? el.value : el.textContent;
}

export function insertValue(
  el: HTMLInputElement,
  start: number,
  end: number,
  text: string,
  iframe: HTMLIFrameElement,
  noRecursion: boolean = false
) {
  // console.log("insertValue", el.nodeName, start, end, "["+text+"]", el);
  if (isTextElement(el)) {
    const val = getValue(el);
    setValue(el, val.substring(0, start) + text + val.substring(end, val.length));
    setCaretPosition(el, start + text.length, iframe);
  } else if (!noRecursion) {
    const selObj: Selection = getWindowSelection(iframe);
    if (selObj && selObj.rangeCount > 0) {
      const selRange = selObj.getRangeAt(0);
      const position = selRange.startOffset;
      const anchorNode = selObj.anchorNode;
      // if (text.endsWith(' ')) {
      //   text = text.substring(0, text.length-1) + '\xA0';
      // }
      insertValue(anchorNode as HTMLInputElement, position - (end - start), position, text, iframe, true);
    }
  }
}

export function isInputOrTextAreaElement(el: HTMLElement): boolean {
  return el != null && (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA');
}

export function isTextElement(el: HTMLElement): boolean {
  return el != null && (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA' || el.nodeName === '#text');
}

export function setCaretPosition(el: HTMLInputElement, pos: number, iframe: HTMLIFrameElement = null) {
  // console.log("setCaretPosition", pos, el, iframe==null);
  if (isInputOrTextAreaElement(el) && el.selectionStart) {
    el.focus();
    el.setSelectionRange(pos, pos);
  } else {
    const range = getDocument(iframe).createRange();
    range.setStart(el, pos);
    range.collapse(true);
    const sel = getWindowSelection(iframe);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export function getCaretPosition(el: HTMLInputElement, iframe: HTMLIFrameElement = null) {
  // console.log("getCaretPosition", el);
  if (isInputOrTextAreaElement(el)) {
    const val = el.value;
    return val.slice(0, el.selectionStart).length;
  } else {
    const selObj = getWindowSelection(iframe); // window.getSelection();
    if (selObj.rangeCount > 0) {
      const selRange = selObj.getRangeAt(0);
      const preCaretRange = selRange.cloneRange();
      preCaretRange.selectNodeContents(el);
      preCaretRange.setEnd(selRange.endContainer, selRange.endOffset);
      const position = preCaretRange.toString().length;
      return position;
    }
  }
}

// Based on ment.io functions...
//

function getDocument(iframe: HTMLIFrameElement) {
  if (!iframe) {
    return document;
  } else {
    return iframe.contentWindow.document;
  }
}

function getWindowSelection(iframe: HTMLIFrameElement): Selection {
  if (!iframe) {
    return window.getSelection();
  } else {
    return iframe.contentWindow.getSelection();
  }
}

export function getContentEditableCaretCoords(ctx: { iframe: HTMLIFrameElement, parent?: Element }) {
  const markerTextChar = '\ufeff';
  const markerId = 'sel_' + new Date().getTime() + '_' + Math.random().toString().substr(2);
  const doc = getDocument(ctx ? ctx.iframe : null);
  const sel = getWindowSelection(ctx ? ctx.iframe : null);
  const prevRange = sel.getRangeAt(0);

  // create new range and set postion using prevRange
  const range = doc.createRange();
  range.setStart(sel.anchorNode, prevRange.startOffset);
  range.setEnd(sel.anchorNode, prevRange.startOffset);
  range.collapse(false);

  // Create the marker element containing a single invisible character
  // using DOM methods and insert it at the position in the range
  const markerEl = doc.createElement('span');
  markerEl.id = markerId;
  markerEl.appendChild(doc.createTextNode(markerTextChar));
  range.insertNode(markerEl);
  sel.removeAllRanges();
  sel.addRange(prevRange);

  const coordinates = {
    left: 0,
    top: markerEl.offsetHeight
  };

  localToRelativeCoordinates(ctx, markerEl, coordinates);

  markerEl.parentNode.removeChild(markerEl);
  return coordinates;
}

function localToRelativeCoordinates(
  ctx: { iframe: HTMLIFrameElement, parent?: Element },
  element: Element,
  coordinates: { top: number; left: number }
) {
  let obj = element as HTMLElement;
  let iframe = ctx ? ctx.iframe : null;
  while (obj) {
    if (ctx.parent != null && ctx.parent === obj) {
      break;
    }
    coordinates.left += obj.offsetLeft + obj.clientLeft;
    coordinates.top += obj.offsetTop + obj.clientTop;
    obj = obj.offsetParent as HTMLElement;
    if (!obj && iframe) {
      obj = iframe;
      iframe = null;
    }
  }
  obj = element as HTMLElement;
  iframe = ctx ? ctx.iframe : null;
  while (obj !== getDocument(null).body && obj != null) {
    if (ctx.parent != null && ctx.parent === obj) {
      break;
    }
    if (obj.scrollTop && obj.scrollTop > 0) {
      coordinates.top -= obj.scrollTop;
    }
    if (obj.scrollLeft && obj.scrollLeft > 0) {
      coordinates.left -= obj.scrollLeft;
    }
    obj = obj.parentNode as HTMLElement;
    if (!obj && iframe) {
      obj = iframe;
      iframe = null;
    }
  }
}
