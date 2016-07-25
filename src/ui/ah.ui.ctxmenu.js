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

var ctxMainNode = false;

//This is messy messy messy.
ah.ui.ContextMenu = function (isChild) {
  var events = ah.events(),
      container = ah.dom.cr('div', 'container ah-stretch'),
      callback = false,
      openChild = false,
      openChildCtx = false,
      childOpener = false,
      pos = {},
      useCatcher = true
  ;

  function getHKText(keys) {
    //OSX
    return keys.replace(/META/g, '⌘').replace(/SHIFT/g, '⇧').replace(/ALT/g, '⌥').replace(/\+/g, '');
  }

  function build(items) {
    container.innerHTML = '';
    
    if (items && !ah.isArr(items) && !ah.isBasic(items)) {
      //It's an object. Map it.
      var i = [];
      
      Object.keys(items).forEach(function (key) {
        if (key === '_' || key === '-') return i.push(key);
        i.push(ah.merge({
          title: key
        }, items[key]));
      });
      
      items = i;
    }

    if (ah.isArr(items)) {
      items.forEach(function (item) {
        var n = ah.dom.cr('div', 'item ah-noselection ah-stretch'),
            title = ah.dom.cr('span', 'title', item.title),
            left = ah.dom.cr('span', 'icon'),
            right = ah.dom.cr('span', 'right-title', item.subtitle || ''),
            id = uuid.v4()
        ;
        
        if (item === '-' || item === '_') {
          ah.dom.ap(container, ah.dom.cr('div', 'separator'));
          return;
        }

        if (!ah.isNull(item.hotkey)) {
          ah.registerHotkey(item.hotkey, item.click);
          right.innerHTML = getHKText(item.hotkey); 
        }

        if (item.faicon && item.faicon.length > 0) {
          left.className = 'ah-stretch icon fa fa-' + (item.faicon || item.icon);
        }

        ah.dom.on(n, 'click', function () {
          if (ah.isFn(item.click)) {
            item.click();
          }

          hide();

          if (useCatcher) {
            ah.cancelCatcher();
          }

          events.emit('Select', item.id || item.title);
        });

        if (ah.isArr(item.children) && item.children.length > 0) {        

          ah.dom.ap(right,
            ah.dom.cr('span', 'right fa fa-chevron-right')
          );

          ah.dom.on(n, 'mouseover', function (e) {
            var p = ah.dom.pos(n),
                s = ah.dom.size(n)
            ;

            n.className = 'item ah-noselection ah-stretch active';

            childOpener = id;

            if (openChild) {
              hideChild();
            }

            openChild = ah.dom.cr('div', 'ah-context-menu ah-prettyscroll');

            openChild.innerHTML = '';
            
            openChildCtx = ah.ui.ContextMenu(true);
            openChildCtx.build(item.children);

            ah.dom.ap(document.body, ah.dom.ap(openChild, openChildCtx.container));
            openChildCtx.setPos(ah.dom.snapInWindow(openChild, pos.x + s.w + 4, p.y + pos.y, {w: s.w}));

            openChildCtx.on(['Destroy'], function () {
              n.className = 'item ah-noselection ah-stretch';
            });

            openChildCtx.on('Hide', hideChild);

            if (isChild) {
              openChildCtx.on(['Select'], function () {
                events.emit('Hide');
                destroy();
              });
            }

          });
        }

        ah.dom.on(n, 'mouseover', function (e) {
          if (openChild && id !== childOpener) {
            hideChild();
          }
        });

        ah.dom.ap(container, 
          ah.dom.ap(n,
            right,
            title,
            left
          )
        );
      });
    }
  }

  function hideChild() {
    if (openChild) {
      openChild.parentNode.removeChild(openChild);
      openChildCtx.destroy();
      openChildCtx = openChild = false;
    }
  }

  function hide() {
    ah.dom.style(ctxMainNode, {
      pointerEvents: 'none',
      opacity: 0
    });
    events.emit('Hide');
    hideChild();
  }

  function show(x, y) {
    if (!ctxMainNode) {
      ctxMainNode = ah.dom.cr('div', 'ah-context-menu ah-prettyscroll');
      ah.dom.ap(document.body, ctxMainNode);
    }

    ctxMainNode.innerHTML = '';

    ah.dom.ap(ctxMainNode, container);

    pos = ah.dom.snapInWindow(ctxMainNode, x, y);

    ah.dom.style(ctxMainNode, {
      pointerEvents: 'auto',
      opacity: 1
    });

    if (useCatcher) {
      ah.catcher(hide);
    }
  }

  function setPos(p) {
    pos = p;
  }

  function attach(node, rightClick) {
    var ev = rightClick ? 'contextmenu' : 'click';

    if (callback) {
      callback();
    }

    callback = ah.dom.on(node, ev, function (e) {
      show(e.clientX, e.clientY);
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.preventDefault();
      return false;
    });
  }

  function destroy() {
    hideChild();
    events.emit('Destroy');
    container.innerHTML = '';
  }

  function setUseCatcher(f) {
    useCatcher = f;
  }

  /////////////////////////////////////////////////////////////////////////////
  //Public interface
  return {
    on: events.on,
    build: build,
    show: show,
    hide: hide,
    attach: attach,
    container: container,
    destroy: destroy,
    setPos: setPos,
    useCatcher: setUseCatcher
  };
};

})();
