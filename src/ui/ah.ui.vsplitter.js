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

ah.ui.VerticalSplitter = function (parent) {
  var container = ah.dom.cr('div', 'ah-fourgrid'),
      splitter = ah.dom.cr('div', 'ah-splitter-ver ah-transition-color'),
      verMover = ah.Mover(splitter, splitter, 'X'),
      left = ah.dom.cr('div', 'panel'),
      right = ah.dom.cr('div', 'panel'),
      events = ah.events()
  ;

  function resize() {
    var s = ah.dom.size(container),
        l = parseInt(splitter.style.left)
    ;
    
    ah.dom.style(left, {
       //background: '#00FF00',
       width: l + 'px',
       height: s.h + 'px',
       marginRight: '4px'
    });
    
    ah.dom.style(right, {
     //  background: '#0000FF',
       width: s.w - l - 8 + 'px',
       height: s.h + 'px'
    });

    events.emit('Resize');
  }
  
   function reset(pos) {
    var s = ah.dom.size(container);

    ah.dom.style(splitter, {
      left: pos || '198px',
      top: 'px'
    });
    
    resize();
  }
  
  ah.dom.ap(container,
    left,
    right,
    splitter
  );
  
  verMover.on('Moving', resize);
  
  if (!ah.isNull(parent)) {
    ah.dom.ap(parent, container);
    reset();
  }

  return {
    on: events.on,
    resize: resize,
    reset: reset,
    body: container,
    left: left,
    right: right  
  }
};
