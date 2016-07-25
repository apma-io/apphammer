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

  var mainBody = false;

  ah.ui.RichSelect = function (owner) {
    var container = ah.dom.cr('span', 'ah-richselect', 'cont'),
        icon = ah.dom.cr('div', 'icon fa fa-chevron-down'),
        list = ah.dom.cr('div'),
        selItem = ah.dom.cr('div', 'item'),
        events = ah.events()
    ;

    function clear() {
      list.innerHTML = '';
    }

    function hide() {
      ah.dom.style(mainBody, {
        opacity: 0
      });
    }

    function load(items) {
      clear();
      if (ah.isArr(items)) {
        items.forEach(function (item) {
          var n = ah.dom.cr('div', 'item');

          if (ah.isStr(item.title)) {
            n.innerHTML = item.title;
          } else if (item.body) {
            ah.dom.ap(n, item.body);
          }

          item.id = item.id || uuid.v4();

          ah.dom.on(n, 'click', function () {
            ah.cancelCatcher();
          });

          ah.dom.ap(list, n);
        });
      }
    }

    function set(id) {

    }

    function get() {

    }

    function show(x, y) {
      if (!mainBody) {
        mainBody = ah.dom.cr('div', 'ah-richselect-options ah-transition');
        ah.dom.ap(document.body, mainBody);
      }

      ah.dom.style(mainBody, {
        opacity: 1,
      });

      mainBody.innerHTML = '';
      ah.dom.ap(mainBody, list);
      ah.dom.snapInWindow(mainBody, x, y);

      ah.catcher(hide);
    }

    ah.dom.on(container, 'click', function (e) {
      show(e.clientX, e.clientY);
    });

    ah.dom.ap(container,
      selItem,
      icon
    );

    if (owner) {
      ah.dom.ap(owner, container);
    }

    return {
      on: events.on,
      set: set,
      get: get,
      clear: clear,
      load: load,
      body: container
    }
  };

})();