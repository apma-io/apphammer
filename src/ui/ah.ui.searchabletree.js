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

/*
  Expected format:
  {
    category: [
      	{
          name: '123'
        }
    ]
  }

*/
ah.ui.SearchableTree = function (parent) {
  var container = ah.dom.cr('div', 'ah-searchable-tree ah-noselection'),
      body = ah.dom.cr('div'),
      searchBox = ah.dom.cr('input', 'search-input'),
      searchFrame = ah.dom.cr('div', 'search-frame'),
      searchIcon = ah.dom.cr('div', 'search-icon fa fa-remove'),
      searchResults = ah.dom.cr('div', 'search-results ah-prettyscroll'),
      library = {},
      events = ah.events()
  ;
  
  ah.dom.ap(searchFrame, 
    searchBox,
    searchIcon
  );
  
  ah.dom.on(searchIcon, 'click', function () {
     search('');
     searchBox.value = '';
     searchBox.focus();
  });
  
  ah.dom.on(searchBox, 'keyup', function (e) {
    search(searchBox.value);
    searchBox.focus();
  });

  ah.dom.ap(container,
    searchFrame,
    searchResults
  );
  
  function search(str) {
   var res = {};

    Object.keys(library).forEach(function(k) {
      var blocks = library[k].filter(function(block) {
        return block.name.toUpperCase().indexOf(str.toUpperCase()) >= 0;
      });
      if (blocks.length > 0) {
        res[k] = blocks;
      }
    });
  	
    build(res);
  }
  
  function setLibrary(items) {
    library = items;
    build(items);
  }
  
  function build(items) {
    searchResults.innerHTML = '';
    
    
    if (!items || Object.keys(items).length === 0) {
      ah.dom.ap(searchResults, ah.dom.cr('div', 'ah-center', '<br/>No results!<br/><span class="fa fa-frown-o" style="font-size:5em;"></span>'));
      return;
    }
    
    Object.keys((items || {})).forEach(function (cat) {
      var cbody = ah.dom.cr('div', 'category-body ah-transition'),
          chead = ah.dom.cr('div', 'category'),
          cheadTitle = ah.dom.cr('span', 'title', cat.toUpperCase()),
          cheadIcon = ah.dom.cr('span', 'fa fa-minus-square-o')
          expanded = true
      ;
      
      ah.dom.ap(searchResults, 
        ah.dom.ap(chead,
          cheadIcon,
          cheadTitle
        ),
        cbody
      );
      
      ah.dom.on(chead, 'click', function (e) {
        expanded = !expanded;
        if (expanded) {
          cheadIcon.className = 'fa fa-minus-square-o';
          ah.dom.style(cbody, {
            height: ''
          });
        } else {
          cheadIcon.className = 'fa fa-plus-square-o';
          ah.dom.style(cbody, {
            height: '0px'
          });
        }
        return ah.dom.nodefault(e);
      });
      
      items[cat].forEach(function (itm) {
        var node = ah.dom.cr('div', 'item', itm.name)
        ;
               
        ah.dom.on(node, 'click', function (e) {
          if (itm && ah.isFn(itm.click)) {
            itm.click(itm);
          }
          events.emit('Select', itm);
          return ah.dom.nodefault(e);
        });
        
        ah.dom.ap(cbody, node);
      });      
    });
  }
  
  function setPos(x, y) {
    var pos = ah.dom.snapInWindow(container, x, y, {w: 0, h: 0});
    
    ah.dom.style(container, {
      left: pos.x + 'px',
      top: pos.y + 'px'
    });

    resize();
  }
  
  function resize() {
    var ps = ah.dom.size(parent),
        sb = ah.dom.size(searchFrame)
    ;

    ah.dom.style(searchResults, {
      height: ps.h - sb.h - 2 + 'px'
    });
  }

  function applyCurrentFilter() {

  }

  function clearSearch() {
    searchBox.value = '';
  }
 
  /////////////////////////////////////////////////////////////////////////////

  if (parent) {
    ah.dom.ap(parent, container);
  }

  return {
    on: events.on,
    applyCurrentFilter: applyCurrentFilter,
    clearSearch: clearSearch,
    build: build,
    body: container,
    search: search,
    setPos: setPos,
    setLibrary: setLibrary,
    resize: resize,
    searchField: searchBox
  };
};
