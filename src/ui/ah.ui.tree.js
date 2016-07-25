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

ah.ui.Tree = function(parent, attrs) {
  var props = ah.merge({
        
      }, attrs),  
      events = ah.events(),
      container = ah.dom.cr('div', 'ah-tree'),
      selected = false
  ;

  /////////////////////////////////////////////////////////////////////////////
  
  function resize() {
    
  }
      
  function loadSubset(data, p) {        
    //Object.keys(data || {}).forEach(function (key) {
    (data || []).forEach(function (obj) {
      var key = obj.title,
          node = ah.dom.cr('div', 'child'),
          children = ah.dom.cr('div', 'children'),
          title = ah.dom.cr('span', '', key),
          expander = ah.dom.cr('span', 'expander fa fa-angle-down'),
          icons = ah.dom.cr('div', 'icons'),
          licon = ah.dom.cr('span', 'expander fa'),
          adder = ah.dom.cr('span', 'adder fa fa-plus-circle'),
          expanded = true
      ;
      
      function toggleChildren(e) {
          expanded = !expanded;
          ah.dom.style(children, {
            height: expanded ? '' : '0px'
          });
          if (expanded) {
            ah.dom.style(expander, {
              '-webkit-transform': 'rotate(0deg)'
            });
          } else {
            ah.dom.style(expander, {
              '-webkit-transform': 'rotate(-90deg)'
            });
          }
        
        return ah.dom.nodefault(e);
      }
      
      function hasChildren() {
        ah.dom.ap(node, 
          expander,
          licon,
          title,
          icons
        );
        
        title.innerHTML = key.toUpperCase();
        
        
      }
      
      ah.dom.ap(p, 
        ah.dom.ap(node,
          licon,
          title,
          icons
        ), 
        children
      );
      
      obj.children = obj.children || {};
      obj.icons = obj.icons || {};
      
      function addIcons() {
        Object.keys(obj.icons).forEach(function (key) {
          var icon = ah.dom.cr('span', 'icon fa fa-' + key);
          ah.dom.on(icon, 'click', function (e) {
            if (obj.icons[key].click) {
              obj.icons[key].click(e);              
            }
            return ah.dom.nodefault(e);
          });
          ah.dom.ap(icons, icon);
        });
      }
      
      function select() {
        if (selected) {
          selected.className = 'child';
        } 
        selected = node;
        node.className = 'child highlight';
      }
      
      function doSelect() {
        ah.dom.on(node, 'click', function () {
          select();
          events.emit('Selected', obj);
          if (ah.isFn(obj.click)) {
            obj.click();
          }
        });
      }
                  
      if (Object.keys(obj.children).length > 0) {        
        hasChildren();
        loadSubset(obj.children, children);
        doSelect();
      } else if (!obj.canAdd) {
        doSelect();
      }
      
      ah.dom.on(expander, 'click', toggleChildren);
      
      ah.dom.on(node, 'mouseover', function () {
        ah.dom.style(icons, {
          opacity: 1
        });
      });
      
      ah.dom.on(node, 'mouseout', function () {
        ah.dom.style(icons, {
          opacity: 0
        });
      });
      
      if (obj.canAdd) {        
        ah.dom.ap(icons, adder);
        
        ah.dom.on(adder, 'click', function (e) {
          var name = prompt('Name'), 
              nobj = {}
          ;
          
          if (obj.children[name]) {
            alert(name + ' already exists');
            return ah.dom.nodefault(e);
          }
          
          if (name && name.length > 0) {
            nobj[name] = {};
            ah.merge(obj.children, nobj);
            hasChildren();
            loadSubset(nobj, children);          
          }
          
          return ah.dom.nodefault(e);
        });  
      }
      
      if (obj.selected) {
        select();
      }
      
      addIcons();
      
      if (obj.licon) {
        licon.className += ' fa-' + obj.licon;
      } else {
        ah.dom.style(licon, {
          display: 'none'
        });
      }
      
      if (obj.dropTarget) {
        ah.DropTarget(node, obj.dropTarget).on('Drop', obj.drop);
        ah.DropTarget(children, obj.dropTarget).on('Drop', obj.drop);
      }
      
      if (obj.draggable) {
        ah.Draggable(node, obj.draggable, obj.dragData).on('Drop', obj.dragEnd);
      }
      
    });
  }
  
  function load(data) {
    clear();
    loadSubset(data, container);
  }
  
  function clear() {
    container.innerHTML = '';
  }
  
  function show() {
    ah.dom.style(container, {
      opacity: 1
    });
  }
  
  function hide() {
    ah.dom.style(container, {
      opacity: 0
    });
  }
  
  /////////////////////////////////////////////////////////////////////////////

  if (parent) {
    ah.dom.ap(parent, container);
  }
  
  return {
    resize: resize,
    on: events.on,
    load: load,
    clear: clear,
    show: show,
    hide: hide
  };
};
