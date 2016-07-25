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

(function () {
  var snackBarNode = false,
      showing = false
  ;

  ah.ready(function () {
    snackBarNode = ah.dom.cr('div', 'ah-noselection ah-transition ah-snackbar');
    ah.dom.ap(document.body, snackBarNode);
  });

  ah.snackBar = function (text, action, fn) {
    var title = ah.dom.cr('span', '', text || ''),
        action = ah.dom.cr('span', 'ah-transition action', action || '')
    ;

    if (showing) {
      //Suppress for now.
      return;
    }

    snackBarNode.innerHTML = '';

    ah.dom.style(snackBarNode, {
      opacity: 1,
      pointerEvents: 'auto',
      bottom:'20px'
    });

    ah.dom.ap(snackBarNode, action, title);

    ah.dom.on(action, 'click', fn);

    setTimeout(function () {
      ah.dom.style(snackBarNode, {
        opacity: 0,
        pointerEvents: 'none',
        bottom: '-48pt'
      });
      showing = false;
    }, 2500 + (text.length * 50));

    showing = true;

  };

})();
