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

ah.ui.SideMenu = function () {
  var container = ah.dom.cr('div', 'ah-transition ah-sidemenu'),
      events = ah.events(),
      visible = false
  ;

  function show() {
    ah.dom.style(container, {
      left: '0px'
    });
    events.emit('Expand');
    events.emit('Show');
  }

  function hide() {
    ah.dom.style(container, {
      left: '-320px'
    });
    events.emit('Collapse');
    events.emit('Hide');
  }

  function toggle() {
    visible = !visible;
    if (visible) {
      show();
    } else {
      hide();
    }
  }

  function append() {
      var args = Array.prototype.slice.call(arguments);
      ah.dom.ap.apply(undefined, [container].concat(args));
    }

  /////////////////////////////////////////////////////////////////////////////
  
  ah.dom.ap(document.body, container);

  /////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    show: show,
    hide: hide,
    toggle: toggle,
    ap: append,
    body: container
  };
};