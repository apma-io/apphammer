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

ah.ui.TabControl = function (owner) {
  var container = ah.dom.cr('div', 'ah-tabcontrol'),
      headings = ah.dom.cr('div', 'headings ah-noselection'),
      body = ah.dom.cr('div', 'body'),
      marker = ah.dom.cr('div', 'marker ah-transition'),
      more = ah.dom.cr('div', 'more fa fa-chevron-down ah-transition'),
      activeTab = false,
      reselect = false,
      picker = ah.ui.ContextMenu()
      tabs = []
  ;

  function buildPicker() {
    picker.build(tabs.map(function (tab) {
      return {
        title: tab.title,
        click: tab.select
      }
    }));
  }

  function addTab(props) {
    var events = ah.events(),
        header = ah.dom.cr('span', 'tab ah-transition', props.toUpperCase()),
        tabBody = ah.dom.cr('div', 'tab-body ah-transition'),
        exports = {},
        lastX = 0
    ;

    function select() {
      var p = ah.dom.pos(header),
          s = ah.dom.size(header)
      ;

      ah.dom.style(marker, {
        width: s.w + 'px',
        left: p.x + 'px'
      });

      ah.dom.addClass(header, 'tab-active');

      if (activeTab) {
        ah.dom.remClass(activeTab.header, 'tab-active');

        ah.dom.style(activeTab.body, {
          opacity: 0,
          visibility: 'hidden'
        });
      }

      ah.dom.style(tabBody, {
        opacity: 1,
        visibility: 'visible'
      });

      activeTab = {
        header: header,
        body: tabBody
      };

      events.emit('Select');

      if (ah.dom.overflows(headings)) {
        ah.dom.style(more, {
          opacity: 1
        });
        headings.scrollLeft = lastX;// + (headings.scrollWidth - lastX);
      } else {
        ah.dom.style(more, {
          opacity: 0
        });
        headings.scrollLeft = 0;
        lastX = p.x;
      }

      reselect = select;
    }

    ah.dom.on(header, 'click', select);

    ah.dom.ap(headings, header);
    ah.dom.ap(body, tabBody);

    if (!ah.dom.overflows(headings)) {
      lastX = ah.dom.pos(header).x;
    }

    exports = {
      on: events.on,
      select: select,
      body: tabBody,
      title: props
    };

    if (tabs.length === 0) {
      select();
    }

    tabs.push(exports);

    buildPicker();

    return exports;
  }

  function resize() {
    if (ah.isFn(reselect)) {
      reselect();
    }
  }

  function clear() {
  	tabs = [];
    headings.innerHTML = '';
    body.innerHTML = '';
    ah.dom.ap(headings, marker);
  }

  ah.dom.on(more, 'click', function (e) {
    picker.show(e.clientX, e.clientY);
  });

  if (owner) {
    ah.dom.ap(owner, 
      ah.dom.ap(container,
        ah.dom.ap(headings,
          marker
        ),
        more,
        body
      )
    );
  }

  return {
    body: container,
    addTab: addTab,
    resize: resize,
    clear: clear
  }
};
