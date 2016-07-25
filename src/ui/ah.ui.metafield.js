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

ah.ui.MetaField = function (meta, value) {
  var events = ah.events(),
      node = false,
      set = function () {},
      types = {

        //Standard text input
        input: function () {
          node = ah.dom.cr('input', 'ah-stretch ah-fill-width ah-meta-widget ');

          ah.dom.on(node, 'change', function () {
            events.emit('change', node.value);
          });

          set = function (v) {
            node.value = v;
          };
        },
        
        //Password
        password: function () {
          types.input();
          node.type = 'password';
        },

        //Dropdown
        dropdown: function () {
          node = ah.dom.cr('select', 'ah-stretch ah-fill-width ah-meta-widget');

          ah.dom.on(node, 'change', function () {
            events.emit('change', node.options[node.selectedIndex].id);
          });

          (meta.options || []).forEach(function (option) {
            ah.dom.ap(node, ah.dom.cr('option', '', option.title || option, option.id || option));            
          });

          set = function (v) {
            Array.prototype.slice.call(node.options).some(function (o, i) {
              if (o.id === v) {
                node.selectedIndex = i;
                return true;
              }
            });
          };
        },

        color: function() {
          node = ah.dom.cr('div', 'ah-stretch ah-fill-width ah-meta-widget');

          function upd(col) {
            ah.dom.style(node, {
              'background-color': col,
              'color': ah.getContrastingColor(col),
              'height': '20px'
            });            
            node.innerHTML = col;
          }

          set = function (v) {
            upd(v);
          };

          ah.dom.on(node, 'click', function () {
            ah.ui.ColorPicker(value, function (col) {
              events.emit('change', col);
              upd(col);
            });
          });
        },

        //Checkbox
        checkbox: function () {
          node = ah.dom.cr('input', '');
          node.type = 'checkbox';

          ah.dom.on(node, 'change', function () {
            events.emit('change', node.checked);
          });

          set = function (v) {
            node.checked = v === '1' || v === true || v === 'true';
          };
        },       

      }
  ;
  
  types.bool = types.checkbox;
  types.string = types.input;

  /////////////////////////////////////////////////////////////////////////////

  if (types[meta.type]) {
    types[meta.type]();
    set(value);
  } else {
    types['input']();
    set(value);
  }


  /////////////////////////////////////////////////////////////////////////////

  return {
    node: node,
    on: events.on,
    set: set
  }
};
