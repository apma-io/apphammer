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

ah.ui.PropertyGridNormal = function (parent) {
    var container = ah.dom.cr('div', 'ah-box-size ah-stretch'),    
      categories = {},
      callbacks = [],
      //tabCtrl = ah.ui.TabControl(container),
      tabs = {},
      tables = {}
  ;

  /*
    Build from meta, load from data store.
    Then listen to changes on each field on the ds.
  */
  function load(meta, data, callback, skipCatHeading) {
    //Clear existing event listeners
    callbacks = callbacks.filter(function (fn) {
      fn();
      return false;
    });

    //tabCtrl.clear();
    tables = {};
    
    container.innerHTML = '';

    Object.keys(meta || {}).forEach(function (category, k) {
      
      
      if (!tables[category] && Object.keys(meta[category]).length > 0) {
        tables[category] = ah.dom.cr('table', 'ah-pgrid-table');

        if (skipCatHeading) {
          ah.dom.ap(container,
            ah.dom.ap(ah.dom.cr('div', 'ah-pgrid'), 
              tables[category]
            )
          );
        } else {
          ah.dom.ap(container,
            ah.dom.cr('h4', '', category.toUpperCase()), 
            ah.dom.ap(ah.dom.cr('div', 'ah-pgrid'), 
              tables[category]
            )
          );          
        }
      }
      
      Object.keys(meta[category] || {}).forEach(function (entry, i) {
        var obj = meta[category][entry],
            row = ah.dom.cr('tr', i % 2 == 1 ? 'row' : 'row-alt'),
            title = ah.dom.cr('td', 'title ah-noselection', obj.title),
            helpCol = ah.dom.cr('td', 'help'),
            fieldCol = ah.dom.cr('td', 'data'),
            field = ah.ui.MetaField(obj, data[category] ? data[category][entry] || '' : ''),
            helpIcon = ah.dom.cr('span', 'ah-transition help-icon fa fa-question-circle'),

            //test
            dude = ah.dom.cr('div', 'ah-pggrid-table-otherdude fa fa-smile-o')
        ;

        callbacks.push(field.on('change', function (value) {
          data[category][entry] = value;
          if (callback) {
            callback(data[category][entry]);
          }
        }));

        //obj.category = category || 'general';
        obj.help = obj.help || obj.description;

        
        if (!obj.help || obj.help.length == 0) {
          ah.dom.style(helpIcon, {
            opacity: 0
          });
        } else {
          ah.Tooltipify(helpIcon, obj.help || '');          
        }
    
        ah.dom.ap(tables[category],
          ah.dom.ap(row,
            ah.dom.ap(helpCol,
              helpIcon
            ),
            title,
            ah.dom.ap(fieldCol,
              field.node//,
            // dude
            )
          )
        )
      });
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  if (parent) {
    ah.dom.ap(parent, container);
  }

  return {
    load: load,
    body: container
  };

};

/*
  Property grid with category tabs.

  Expected data from store is something like:
  {
    "uuid": {
      "field1": "value",
      "field2": "value",
      ...
    },
   ...
  }

  The ID supplied on load corresponds to the uuid in the 
  above example.

  http://typedrummer.com/j34n6m

*/
ah.ui.PropertyGrid = function (parent) {
  var container = ah.dom.cr('div'),    
      categories = {},
      callbacks = [],
      tabCtrl = ah.ui.TabControl(container),
      tabs = {},
      tables = {}
  ;

  /*
    Build from meta, load from data store.
    Then listen to changes on each field on the ds.
  */
  function load(meta, id, dstore, properties) {
    //Clear existing event listeners
    callbacks = callbacks.filter(function (fn) {
      fn();
      return false;
    });

    tabCtrl.clear();
    tables = {};
    
   // container.innerHTML = '';

    Object.keys(meta || {}).forEach(function (entry, i) {
      var obj = meta[entry],
          row = ah.dom.cr('tr', i % 2 == 1 ? 'row' : 'row-alt'),
          title = ah.dom.cr('td', 'title ah-noselection', obj.title),
          helpCol = ah.dom.cr('td', 'help'),
          fieldCol = ah.dom.cr('td', 'data'),
          field = ah.ui.MetaField(obj, dstore ? dstore.read(id, entry) : properties[entry]),
          helpIcon = ah.dom.cr('span', 'ah-transition help-icon fa fa-question-circle'),

          //test
          dude = ah.dom.cr('div', 'ah-pggrid-table-otherdude fa fa-smile-o')
      ;

      callbacks.push(field.on('change', function (value) {
        if (dstore) {
          dstore.update(id, entry, value);          
        }
      }));

      if (dstore) {
        callbacks.push(dstore.on(id + ':' + entry + ':change', function (d) {
          field.set(d);
        }));
      }

      obj.category = obj.category || 'general';

      if (!tables[obj.category]) {
        tables[obj.category] = ah.dom.cr('table', 'ah-pgrid-table');
        ah.dom.ap(tabCtrl.addTab(obj.category).body, 
          ah.dom.ap(ah.dom.cr('div', 'ah-pgrid'), 
            tables[obj.category]
          )
        );
      }
      
      if (!obj.help || obj.help.length == 0) {
        ah.dom.style(helpIcon, {
          opacity: 0
        });
      }
  
      ah.Tooltipify(helpIcon, obj.help || '');
  
      ah.dom.ap(tables[obj.category],
        ah.dom.ap(row,
          ah.dom.ap(helpCol,
            helpIcon
          ),
          title,
          ah.dom.ap(fieldCol,
            field.node//,
           // dude
          )
        )
      )
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  if (parent) {
    ah.dom.ap(parent, container);
  }

  return {
    load: load,
    body: container
  };
};

