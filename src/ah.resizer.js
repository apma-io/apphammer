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

ah.Resizer = function (handle, target) {
  var events = ah.events(),
      moving = false,
      delta = {x: 0, y: 0},
      size = {w: 0, h: 0},
      osize = {w: 0, h: 0},
      enabled = true
  ;

  if (!handle) {
    handle = target;
  }

  function enable() {
    enabled = true;
  }

  function disable() {
    enabled = false;
  }

  ah.dom.on(handle, 'mousedown', function (e) {
    var upper, 
        mover
    ;

    if (!enabled) {
      return;
    }

    document.body.className += ' ah-noselection';

    osize = ah.dom.size(target);

    delta.x = e.clientX;
    delta.y = e.clientY;

    moving = true;

    upper = ah.dom.on(document.body, 'mouseup', function (e) {
      upper();
      mover();

      events.emit('Done', size.w, size.h);

      document.body.className = document.body.className.replace('ah-noselection', '');
      
      moving = false;
      return false;
    });

    mover = ah.dom.on(document.body, 'mousemove', function (e) {
      if (moving) {

        size.w = osize.w + (e.clientX - delta.x);
        size.h = osize.h + (e.clientY - delta.y);

        ah.dom.style(target, {
          width: size.w + 'px',
          height: size.h + 'px'
        });

        events.emit('Resizing', size.x, size.y);
      }
      return false;
    });

  });

  return {
    on: events.on,
    enable: enable,
    disable: disable
  };
};
