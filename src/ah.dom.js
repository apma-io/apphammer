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
  var events = ah.events();
  
  ah.ready(function () {
    var rtimeout = false;
    
    //Listen to resize event
    ah.dom.on(window, 'resize', function () {
      clearTimeout(rtimeout);
      rtimeout = setTimeout(function () {
        console.log('resized');
        events.emit('resize');
      }, 100);
    });
  });

  //Append a set of nodes to a given target
  function append(target) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 1);

    if (target && target.appendChild) {
      args.forEach(function (node) {
        try {
          target.appendChild(node);          
        } catch (e) {
          //Um not cool brah.
        }
      });
    }

    return target;
  }

  //Create a dom node
  function crnode(type, cssClass, value, id) {
    var n = document.createElement(type);
    if (!ah.isNull(cssClass)) {
      n.className = cssClass;
    }
    if (!ah.isNull(value)) {
      n.innerHTML = value || '';
    }
    if (!ah.isNull(id)) {
      n.id = id || '';
    }
    return n;
  }

  //Style one or more nodes
  function style(node, st) {
    if (node.forEach) {
      node.forEach(function (n) {
        style(n, st);
      });
      return;
    }

    Object.keys(st).forEach(function (e) {
      node.style[e] = st[e];
    });
  }

  //DOM on
  function on(target, event, func) {
    var s = [];
    
    if (target === document.body && event === 'resize') {
      return events.on(event, func);
    }

    if (ah.isArr(target)) {
      target.forEach(function (t) {
        s.push(on(t, event, func));
      });
      return function () {
        s.forEach(function (f) {
          f();
        });
      };
    }

    function callback() {
      if (func) {
        return func.apply(undefined, arguments);
      }
      return;
    }

    if (ah.isFn(target.addEventListener)) {
      target.addEventListener(event, callback, false);
    } else {
      target.attachEvent('on' + event, callback, false);
    }   

    return function () {
      if (ah.isFn(window.removeEventListener)) {
        target.removeEventListener(event, callback, false);
      } else {
        target.detachEvent('on' + event, callback);
      }
    };
  }

  function nsize(node) {
    return {
      w: node.offsetWidth,
      h: node.offsetHeight
    };
  }

  function npos(node) {
    return {
      x: node.offsetLeft,
      y: node.offsetTop
    }
  }

  function nodefault (e) {
    e.cancelBubble = true;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }

  function snapInWindow(node, x, y, offsets) {
    var vp = nsize(document.body), s;
    s = nsize(node);

    if (x + s.w - 2 > vp.w) {
      x = vp.w - s.w - 2;
      if (offsets && offsets.w) {
        x -= offsets.w;
      }
    }

    if (y + s.h - 2 > vp.h) {
      y = vp.h - s.h - 2;
    }

    if (y < 0) {
      y = 0;
    }

    ah.dom.style(node, {
      left: x + 'px',
      top: y + 'px'
    });

    return {
      x: x,
      y: y
    }

  }

  function addClass(node, classN) {
    node.className += ' ' + classN;
  }

  function remClass(node, classN) {
    node.className = node.className.replace(classN, '');
  }

  function overflows(element){
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

  /////////////////////////////////////////////////////////////////////////////
  //Public interface

  ah.dom = {
    ap: append,
    cr: crnode,
    on: on,
    style: style,
    size: nsize,
    pos: npos,
    snapInWindow: snapInWindow,
    nodefault: nodefault,
    addClass: addClass,
    remClass: remClass,
    overflows: overflows
  };

})();
