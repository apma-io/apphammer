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

  //Create a new pane
  function Pane(parent, title, faicon) {
    var header = ah.dom.cr('div', 'ah-noselection ah-transition ah-accordion-pane-header'),
        stateIcon = ah.dom.cr('span', 'icon fa fa-chevron-right'),
        title = ah.dom.cr('span', 'title', title || '???'),
        body = ah.dom.cr('div', 'ah-accordion-pane-body', ''),
        expanded = false,
        visible = true
    ;

    function expand() {
      ah.dom.style(stateIcon, {
        transform: 'rotate(90deg)'
      });

      ah.dom.style(body, {
        visibility: 'visible',
        height: '240px'
      });

      expanded = true;
    }

    function collapse() {
      ah.dom.style(stateIcon, {
        transform: 'rotate(0deg)'
      });

      ah.dom.style(body, {
        //visibility: 'hidden',
        height: '0px'
      });

      expanded = false;
    }

    function toggleExpanded() {
      expanded = !expanded;
      if (expanded) {
        expand();
      } else {
        collapse();
      }
    }

    function hide() {

      visible = false;
    }

    function show() {

      visible = true;
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
      ah.dom.ap.apply(undefined, [body].concat(args));
    }

    ///////////////////////////////////////////////////////////////////////////

    ah.dom.on(header, 'click', toggleExpanded);

    ah.dom.ap(parent,
      ah.dom.ap(header,
        stateIcon,
        title
      ),
      body
    )

    ///////////////////////////////////////////////////////////////////////////

    return {
      expand: expand,
      collapse: collapse,
      hide: hide,
      show: show,
      toggle: toggle,
      body: body,
      ap: append
    }
  }

  ah.ui.Accordion = function (parent) {
    var container = ah.dom.cr('div', 'ah-prettyscroll ah-accordion'),
        panes = []
    ;

    function addPane(title, faicon) {
      return Pane(container, title, faicon);
    }

    ///////////////////////////////////////////////////////////////////////////

    if (parent) {
      ah.dom.ap(parent, container);
    }
    
    ///////////////////////////////////////////////////////////////////////////

    return {
      Pane: addPane,
      body: container
    }
  };

})();
