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

ah.ui.Form = function (parent) {
  var container = ah.dom.cr('div', 'ah-form-container'),
      form = ah.dom.cr('form', 'ah-form'),
      buttonsDiv = ah.dom.cr('div', 'buttons'),
      events = ah.events(),
      callbacks = [],
      serialized = {},
      exports = {},
      validationStack = [],
      lastMeta = false,
      lastButtons = false
  ;
  
  form.onsubmit = function () {
    //Could do validation here..    
    return false;
  };
  
  /////////////////////////////////////////////////////////////////////////////
  
  function load(meta, id, dstore, buttons) {
    serialized = {};
    
    callbacks = callbacks.filter(function (fn) {
       fn();
       return false;
    });
    
    if (!meta && lastMeta) {
      meta = lastMeta;
    }
    
    if (!buttons && lastButtons) {
      buttons = lastButtons;
    }
    
    lastMeta = meta;
    lastButtons = buttons;
    
    validationStack = [];    
    form.innerHTML = '';
    
    Object.keys(meta || {}).forEach(function (entry, i) {
      var obj = meta[entry],
          title = ah.dom.cr('div', 'title', obj.title),
          field = ah.ui.MetaField(obj, dstore ? dstore.read(id, entry) : ''),
          error = ah.dom.cr('div', 'error')
      ;
      
      serialized[entry] = dstore ? dstore.read(id, entry) : '';
      
      field.on('change', function (value) {
          serialized[entry] = value;
      });
      
      if (obj.required) {
        ah.dom.ap(title, 
          ah.dom.cr('span', 'cancel-text', '*')
        );
      }
      
      validationStack.push(function () {
        var err = false;        
        //Do a validation
        error.innerHTML = '';
        ah.dom.style(error, {display: 'none'});
        if (ah.isFn(obj.validate)) {
          err = obj.validate(serialized[entry], serialized);
          if (err) {
            ah.dom.style(error, {display: 'block'});
            error.innerHTML = err;
            return true;            
          }
        }
        
        if (obj.required && (!serialized[entry] || serialized[entry].length === 0)) {
          ah.dom.style(error, {display: 'block'});            
          error.innerHTML = 'Required field';
          return true;
        }
        
        return false;
      });
      
      if (!ah.isNull(dstore)) {
        callbacks.push(field.on('change', function (value) {
          dstore.update(id, entry, value);
        }));
    
        callbacks.push(dstore.on(id + ':' + entry + ':change', function (d) {
          field.set(d);
        }));
      }
      
      ah.dom.ap(form,
        title,
        error,
        field.node
      );
    });
    
    if (!ah.isNull(buttons)) {
      Object.keys(buttons).forEach(function (key) {
        var obj = buttons[key],
            b = ah.dom.cr('button', obj.className || '', key),
            timer = false,
            step = '',
            exp = {
              disable: function () {
                b.disabled = true;
              },
              enable: function () {
                b.disabled = false;
              },
              setCaption: function () {
                
              },
              startWork: function (desc) {
                b.disabled = true;
                b.innerHTML = desc || 'Working';
                timer = setInterval(function () {
                  step += '.';
                  b.innerHTML = (desc || 'Working') + step;
                  if (step.length > 3) step = ''; 
                }, 800);
              },
              endWork: function () {
                clearInterval(timer);
                b.disabled = false;
                b.innerHTML = key;                
              }
            }
        ;
        
        ah.dom.on(b, 'click', function () {          
          obj.click.apply(exp, [exports, serialized, exp]);
        });
        
        ah.dom.ap(buttonsDiv, b);        
      });
    }
    
    ah.dom.ap(form, buttonsDiv);
    
    events.emit('Load', id, dstore);
  }  
  
  function validate() {
    var error = false;
    validationStack.forEach(function (fn) {
      var r = fn();
      if (r && !error) {
        error = true;
      }
    });
    return !error;
  }
  
  function post(url, fn) {
    //Post form
    ah.ajax({
      url: url,
      type: 'POST',
      data: serialized,
      success: function (rval) {
        fn(true, rval);
      },
      error: function (rval) {
        fn(false, rval);
      }
    });
  }
  
  function pull(url) {
    var ss = ah.SyncStore(uuid.v4());
    //Pull form from ajax.
    //This will create a datastore and attach it to the form.
  }
  
  /////////////////////////////////////////////////////////////////////////////
  
  ah.dom.ap(container, form);
  
  if (parent) {
    ah.dom.ap(parent, container);
  }
  
  exports = {
    on: events.on,
    body: container,
    load: load,
    post: post,
    validate: validate
  };
  
  return exports;
};