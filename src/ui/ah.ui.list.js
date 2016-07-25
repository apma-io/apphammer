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

ah.ui.List = function (parent, attrs) {
  var properties = ah.merge({
        selectable: false,
        draggable: true,
        allowClones: false,
        canAdd: true
      }, attrs),
      events = ah.events(),
      selected = false,
      items = [],
      container = ah.dom.cr('div', 'ah-list ah-noselection'),
      itemNode = ah.dom.cr('div', 'item-container ah-prettyscroll'),
      addContainer = ah.dom.cr('div', 'add-container'),
      addInput = ah.dom.cr('input'),
      addIcon = ah.dom.cr('div', 'add fa fa-plus-circle ah-transition'),
      nodes = {}
  ;

  if (!properties.canAdd) {
    ah.dom.style(addContainer, {
      display: 'none'
    });
  }

  //Add a new entry to the list
  /*
    - dragType
    - dragPayload
    - id
    - title
    - select - fn
    - icons []
      - click - fn
      - faicon
  */
  function addItem(item) {
    var n = ah.dom.cr('div', 'item', item.title),
        icons = ah.dom.cr('div', 'icons'),
        title = ah.dom.cr('span', 'title', item.title || '???'),
        exports = {}
    ;
    
    nodes[item.id] = n;

    function addIcons() {
      icons.innerHTML = '';
      if (ah.isArr(item.icons)) {
        item.icons.forEach(function (icon) {
          var i = ah.dom.cr('span', 'icon fa fa-' + icon.faicon);

          if (icon.icon && icon.icon.length > 0 && !icon.faicon) {
            i.className = 'icon fa ' + icon.icon;
          }

          ah.dom.on(i, 'click', function (e) {
            if (ah.isFn(icon.click)) {
              icon.click(e, item);
            }
            if (ah.isFn(icon.onclick)) {
              icon.onclick(e, item);
            }
          });

          ah.dom.ap(icons, i);
        });
      }
    }

    ah.dom.on(n, 'click', function () {
      if (properties.selectable) {
        if (selected) {
          selected.className = 'item';
        }
        n.className = 'item item-active';
        selected = n;
      }

      events.emit('Select', item);
      if (ah.isFn(item.select)) {
        item.select(item);
      }
      if (ah.isFn(item.click)) {
        item.click(item);
      }
      if (ah.isFn(item.onclick)) {
        item.onclick(item);
      }
    });

    if (properties.draggable) {
      ah.Draggable(n, item.dragType, item.dragPayload).on('DragStart', function (e) {
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData('Text', item.title);
        e.dataTransfer.setData('Type', item.dragType);
        e.dataTransfer.setData('Properties', JSON.stringify(item.dragPayload || {}));
      });
    }

    addIcons();

    ah.dom.ap(itemNode, 
      ah.dom.ap(n,
        icons//,
       // title
      )
    );

    exports = {

    };

    items.push(item);

    return exports;
  }

  function deleteItem(id) {
    clear();

    items = items.filter(function (item) {
      if (item.id === id) {
        return false;
      }
      addItem(item);
      return true;
    });
  }

  function clear() {
    itemNode.innerHTML = '';
  }

  function clearInput() {
    addInput.value = '';
  }

  function doAdd() {
    if (addInput.value.length === 0) {
      return;
    }

    events.emit('add', addInput.value);

    events.emit('AddItemRequest', addInput.value, function (err, data) {
      if (!err) {
        if (!properties.allowClones) {
          if (items.filter(function (i) {
            return (i.id === data.id && i.id) || (i.title === data.title);
          }).length > 0) {
            ah.snackBar('The item is already in the target list');
            return;
          }
        }
        addItem(data);
        addInput.value = '';
        addInput.focus();
      } else {
      }
    });
  }
  
  function build(items) {
    clear();
    items.forEach(function (item) {
       addItem(item);
    });
  }
  
  function toArray() {
    return items.map(function (a) {
      return a.title;
    });
  }
  
  function fromArray(arr) {
    if (ah.isArr(arr)) {
      arr.forEach(function (itm) {
        addItem({
          id: uuid.v4(),
          title: itm
        });
      });
    }
  }
  
  function toJSON() {
    var r = {};
    items.forEach(function (itm) {
      r[itm.id] = itm.title;
    });
    return r;
  }
  
  function fromJSON(o) {
    Object.keys(o).forEach(function (key) {
      addItem({id: key, title: o[key]});
    });
  }
  
  function rmItem(item) {
    if (nodes[item.id]) {
      nodes[item.id].parentNode.removeChild(nodes[item.id]);
    }
  }

  /////////////////////////////////////////////////////////////////////////////

  ah.dom.on(addIcon, 'click', doAdd);
  ah.dom.on(addInput, 'keyup', function (e) {
    if (e.keyCode === 13) {
      doAdd();
    }
  });

  ah.dom.ap(container, 
    itemNode,
    ah.dom.ap(addContainer,
      addInput,
      addIcon
    )
  );

  if (parent) {
    ah.dom.ap(parent, container);
  }

  /////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    clearInput: clearInput,
    build: build,
    addItem: addItem,
    remItem: deleteItem,
    clear: clear,
    body: container,
    toArray: toArray,
    toJSON: toJSON,
    fromArray: fromArray,
    fromJSON: fromJSON,
    rmItem: rmItem
  };
};

