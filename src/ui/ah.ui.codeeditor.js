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


  ah.ui.CodeEditor = function (parent, attrs) {
    var body = ah.dom.cr('div'),
        editor = ace.edit(body),
        activeMode = false,
        events = ah.events()
    ;
    
    ah.dom.style(body, {
       width: '100%',
       height: '100%'
    });
    
    function setTheme(theme) {
      if (editor) {
        editor.setTheme("ace/theme/" + theme);
      }
    }
    
    function resize() {
      editor.resize();
    }
    
    function setMode(mode) {
      if (!editor) {
        return;
      }
      
      switch(mode) {
        case 'JS': 
          activeMode = ace.require('ace/mode/javascript').Mode;          
          break;
        case 'CSS':
          activeMode = ace.require('ace/mode/css').Mode;
          break;
        case 'HTML':
          activeMode = ace.require('ace/mode/html').Mode;
          break;
        default:
          activeMode = false;
          break;
      }
      if (activeMode) {
        editor.getSession().setMode(new activeMode());
      }
    }
    
    if (parent) {
      ah.dom.ap(parent, body);
    }
    
    setTheme('twilight');
    
    editor.on('change', function () {
       events.emit('Change', editor.getSession().getValue());
    });
    
    editor.on('focus', function () {
       events.emit('Focus');
    });
    
    editor.on('blur', function () {
       events.emit('Blur');
    });
    
    if (attrs) {
      setTheme(attrs.theme || 'twilight');
      setMode(attrs.mode || 'JS');
    }
    
    function setValue(v) {
      editor.setValue(v);
    }
    
    function getValue() {
      return editor.getValue();
    }
    
    return {
      body: body,
      on: events.on,
      resize: resize,
      setTheme: setTheme,
      setMode: setMode,
      value: getValue,
      setValue: setValue
    }
  };

})();
