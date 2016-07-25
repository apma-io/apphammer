/******************************************************************************

  Copyright (c) 2016 IQumulus LLC

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


******************************************************************************/

ah.ui.Toolbar = function (owner) {
  var container = ah.dom.cr('div', 'ah-toolbar ah-noselection'),
      left = ah.dom.cr('div', 'left'),
      right = ah.dom.cr('div', 'right')
  ;

  /////////////////////////////////////////////////////////////////////////////

  //Append n nodes to the left part
  function apLeft() {
    var args = Array.prototype.slice.call(arguments);
    // args = args.map(function (node) {
    //   return ah.dom.ap(ah.dom.cr('span', 'marginer'), node);
    // });
    ah.dom.ap.apply(undefined, [left].concat(args));
  }

  //Append n nodes to the right
  function apRight() {
    var args = Array.prototype.slice.call(arguments);
    // args = args.map(function (node) {
    //   return ah.dom.ap(ah.dom.cr('span', 'marginer'), node);
    // });
    ah.dom.ap.apply(undefined, [right].concat(args));
  }

  function crIcon(icon) {
    var i;
    if (icon && icon.icon) {
      i = ah.dom.cr('div', 'ah-transition icon fa fa-' + icon.icon);
      if (ah.isFn(icon.click)) {
        ah.dom.on(i, 'click', function () {
          icon.click();
        });
      }
      return i;
    }
    return false;
  }

  function leftIcon(icon) {
    var i = crIcon(icon);
    if (i) {
      ah.dom.ap(left, i);
    }
  }

  function rightIcon(icon){
    var i = crIcon(icon);
    if (i) {
      ah.dom.ap(right, i);
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  ah.dom.ap(owner, 
    ah.dom.ap(container, 
      left, 
      right
    )
  );

  /////////////////////////////////////////////////////////////////////////////
  return {
    apLeft: apLeft,
    apRight: apRight,
    leftIcon: leftIcon,
    rightIcon: rightIcon
  }
};
