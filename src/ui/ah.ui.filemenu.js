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

ah.ui.FileMenu = function (owner) {
  var container = ah.dom.cr('span', 'ah-filemenu ah-noselection'),
      clickMode = false,
      selected = false
  ;

  function unselect() {
    if (selected) {
      selected.n.className = 'item';
      selected.ctx.hide();
    }
  }

  function build(items) {
    container.innerHTML = '';
    
    if (items && !ah.isArr(items) && !ah.isBasic(items)) {
      //It's an object. Map it.
      var i = [];
      
      Object.keys(items).forEach(function (key) {
        i.push(ah.merge({
          title: key
        }, items[key]));
      });
      
      items = i;
    }


    if (ah.isArr(items)) {
      items.forEach(function (item) {
        var n = ah.dom.cr('span', 'item ah-transition', item.title.toUpperCase(), item.id),
            ctx = ah.ui.ContextMenu()
        ;

        ctx.useCatcher(false);

        if (item.children) {
          ctx.build(item.children);
        }

        function select() {
          var p = ah.dom.pos(n),
              s = ah.dom.size(n)
          ;

          n.className = 'item active';
          ctx.show(p.x, p.y + s.h);

          selected = {
            ctx: ctx,
            n: n
          };
        }

        ah.dom.on(n, 'click', function (e) {
          var bind = ah.dom.on(document.body, 'click', function (e) {
            unselect();
            clickMode = false;
            bind();
          });

          if (clickMode) {
            unselect();
            clickMode = false;
            return;
          }
          select();
          clickMode = true;

          return ah.dom.nodefault(e);
        });

        ctx.on('Hide', function () {
          n.className = 'item';
        });

        ctx.on('Select', function () {
          unselect();
          clickMode = false;
        });

        ah.dom.on(n, 'mouseover', function (e) {
          if (clickMode) {
            unselect();
            select();
          }
        });

        ah.dom.ap(container, n);
      });
    }
  }

  if (owner) {
    ah.dom.append(owner);
  }

  return {
    build: build,
    body: container
  }
};
