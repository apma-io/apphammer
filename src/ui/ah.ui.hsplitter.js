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

ah.ui.HorizontalSplitter = function (parent) {
  var container = ah.dom.cr('div', 'ah-fourgrid'),
      splitter = ah.dom.cr('div', 'ah-splitter-hor ah-transition-color'),
      horMover = ah.Mover(splitter, splitter, 'Y'),
      top = ah.dom.cr('div', 'panel'),
      bottom = ah.dom.cr('div', 'panel'),
      events = ah.events()
  ;

  function resize() {
    var s = ah.dom.size(container),
        l = parseInt(splitter.style.top)
    ;
    
    ah.dom.style(top, {
       //background: '#00FF00',
       width: s.w + 'px',
       height: l + 'px',
       marginRight: '4px'
    });
    
    ah.dom.style(bottom, {
     //  background: '#0000FF',
       width: s.w + 'px',
       height: s.h - l - 8 + 'px'
    });

    events.emit('Resize');
  }
  
   function reset(pos) {
    var s = ah.dom.size(container);

    ah.dom.style(splitter, {
      left: '0px',
      top: pos || '198px'
    });
    
    resize();
  }
  
  ah.dom.ap(container,
    top,
    bottom,
    splitter
  );
  
  horMover.on('Moving', resize);
  
  if (!ah.isNull(parent)) {
    ah.dom.ap(parent, container);
    reset();
  }

  return {
    on: events.on,
    resize: resize,
    reset: reset,
    body: container,
    top: top,
    bottom: bottom  
  }
};
