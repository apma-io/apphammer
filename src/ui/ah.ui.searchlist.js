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
  var container = ah.dom.cr('div', 'ah-transition ah-searchlist');

  ah.ui.SearchList = function () {
    var frame = ah.dom.cr('div'),
        searchIcon = ah.dom.cr('div', 'icon fa fa-search'),
        search = ah.dom.cr('input', 'ah-stretch'),
        body = ah.dom.cr('div', 'body'),
        events = ah.events(),
        isVisible = false,
        loadedSet = [],
        subSet = [],
        selected = false,
        selectedID = 0,
        keyListener = false,
        itemNodes = []
    ;
    
    search.placeholder = 'Enter search string (ESC to cancel)';
    
    function resetSelection() {
      if (subSet.length > 0) {
        selectedID = 0;
        selected = subSet[0];
        itemNodes[0].className = 'item item-highlight';
      }
    }
    
    function show(x, y) {
      
      if (ah.isNull(container.parentNode)) {
        ah.dom.ap(document.body, container);
      }
      container.innerHTML = '';
      ah.dom.ap(container, frame);
      
      ah.dom.style(container, {
        left: x + 'px',
        top: y + 'px',
        opacity: 1,
        visible: 1
      });
      isVisible = true;
      
      search.value = '';
      doSearch('');
      
      //Listen to down arrow
      keyListener = ah.dom.on(document.body, 'keydown', function (e) {
        if (e.keyCode === 38) {
          
          if (selectedID >= 0 && selectedID < itemNodes.length) {
            itemNodes[selectedID].className = 'item';
          }
          
          selectedID = (selectedID - 1) % itemNodes.length;
          selectedID = selectedID >= 0 ? selectedID : itemNodes.length - 1;
          itemNodes[selectedID].className = 'item item-highlight';
          
          selected = subSet[selectedID];
          events.emit('Hover', selected);
          return ah.dom.nodefault(e);
        }
        if (e.keyCode === 40) {
          if (selectedID >= 0 && selectedID < itemNodes.length) {
            itemNodes[selectedID].className = 'item';
          }

          selectedID = (++selectedID) % itemNodes.length;
          itemNodes[selectedID].className = 'item item-highlight';
          
          selected = subSet[selectedID];
          events.emit('Hover', selected);
          return ah.dom.nodefault(e);
        }
        if (e.keyCode === 13) {
          events.emit('Select', selected.actual);
          hide();
          return ah.dom.nodefault(e);
        }
        if (e.keyCode === 27) {
          hide();
          return ah.dom.nodefault(e);
        }
      });
      
      search.focus();
    }
    
    function hide() {
      ah.dom.style(container, {
        opacity: 0,
        visible: 0
      });
      isVisible = false;
      keyListener();
    }
    
    function load(items) {
      loadedSet = items;
      loadSubset(items.map(function (it) {
        return {
          actual: it,
          formatted: it
        };
      }));
    }
    
    function loadSubset(items) {
      itemNodes = [];
      subSet = items || [];
      body.innerHTML = '';
      (items || []).forEach(function (item) {
         var i = ah.dom.cr('div', 'item', item.formatted);
         ah.dom.on(i, 'click', function () {
           events.emit('Select', item.actual);
           hide();
         });
         ah.dom.ap(body, i);
         itemNodes.push(i);
      });
      resetSelection();
    }
    
    function doSearch(str) {
       var sub = [];
       
       loadedSet.forEach(function (item) {
         if (item.indexOf(str) != -1) {
           sub.push({
             actual: item,
             formatted: item.replace(str, '<span class="highlight">' + str + '</span>')
           });
         }
       });
       
       loadSubset(sub.length > 0 ? sub : loadedSet);
    }
    
    ///////////////////////////////////////////////////////////////////////////
    
    ah.dom.on(search, 'keyup', function (e) {
      if (e.keyCode !== 38 && e.keyCode !== 40) {
        doSearch(search.value);        
      }
    });
    
    ah.dom.ap(frame,
      ah.dom.ap(ah.dom.cr('div', 'searchframe'),
        search,
        searchIcon
      ),
      body
    );
    
    ///////////////////////////////////////////////////////////////////////////
    
    return {
      load: load,
      loadSubSet: loadSubset,
      on: events.on,
      show: show,
      hide: hide,
      search: doSearch
    }
  };
})();
