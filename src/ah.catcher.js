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
  var catcherNode = false,
      callback = false
  ;


  function hide() {
    if (!catcherNode) return;
    
    if (callback) {
      callback();
      callback = false;
    }

    ah.dom.style(catcherNode, {
      display: 'none'
    });
  }

  ah.catcher = function (dim, fn, noAutoExit) {
    if (!fn && dim) {
      fn = dim;
      dim = undefined;
    }

    if (!catcherNode) {
      catcherNode = ah.dom.cr('div', 'ah-catcher');
      ah.dom.ap(document.body, catcherNode);
    }

    ah.dom.style(catcherNode, {
      display: 'block',
      background: dim ? '#000': '',
      opacity: dim ? 0.4 : 1.0
    });

    callback = ah.dom.on(catcherNode, 'click', function () {
      if (fn) {
        fn();
      }
      if (!noAutoExit) {
        hide();
      }
    });

  };

  ah.cancelCatcher = function () {
    hide();
  };

})();
