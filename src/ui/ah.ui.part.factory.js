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
  
  /////////////////////////////////////////////////////////////////////////////

  //Create a new toolbar
  function createToolbar(meta) {
    var tb = ah.ui.Toolbar(document.body)
    ;
    
    meta = meta || {};
    
    function cr(i) {
      
    }
    
    (meta.left || []).forEach(function (l) {      
      if (ah.isStr(l)) {        
        ah.ui.part(l, function (other) {
          tb.apLeft(other.body);
        });         
      } 
      if (l && l.icon && l.icon.length > 0) return tb.leftIcon(l);
      
    });
    
    (meta.right || []).forEach(function (l) {
      if (ah.isStr(l)) {        
        ah.ui.part(l, function (other) {
          tb.apRight(other.body);
        });
        return;
      } 
      if (l && l.icon && l.icon.length > 0) return tb.rightIcon(l); 
    });
    
    return tb;
  }
  
  //Create a filemenu
  function createFMenu(meta) {
    var fm = ah.ui.FileMenu();
    fm.build(meta.items);
    return fm;
  }
  
  //Create a window
  function createWindow(meta) {
    var win = ah.ui.Window(meta);
    
    function addToBody(what) {
      ah.ui.part(what, function (other) {
         ah.dom.ap(win.body, other.body);
      });
    }
    
    if (meta.body) {
      if (ah.isArr(meta.body)) {
        meta.body.forEach(addToBody);  
      } else if (ah.isStr(meta.body)) {
        addToBody(meta.body);
      }
    }
    
    return win;
  }
  
  //Create property grid
  function createPGrid(meta) {
    var pg = ah.ui.PropertyGrid();
    if (meta && meta.schema) {
      
    }
    return pg;
  }
  
  //Create a context menu
  function createCTX(meta) {
    var ctx = ah.ui.ContextMenu();
    
    if (meta) {      
      if (ah.isStr(meta.attachTo)) {
        ah.ui.part(meta.attachTo, function (other) {
           ctx.attach(other.body, meta.rightClick || false);
        });
      }
      //if (ah.isArr(meta.items)) {
        ctx.build(meta.items);
      //}
    }
    
    return ctx;
  }
  
  //Create accordion
  function createAccordion(meta) {
    
  }
  
  //Create a tab control
  function createTabCtrl(meta) {
    
  }
  
  //Create a list
  function createList(meta) {
    var l = ah.ui.List(meta);
    
    if (meta && meta.items) {
      l.build(meta.items);
    }
    
    return l;
  }
  
  //Create a form
  function createForm(meta) {
    var form = ah.ui.Form();
    if (meta.schema) {
      form.load(meta.schema, null, null, meta.buttons);
    }
    return form;
  }
  
  //Create a sidemenu
  function createSideMenu(meta) {
    var sm = ah.ui.SideMenu();
    
    function addToBody(what) {
      ah.ui.part(what, function (other) {
         sm.ap(other.body);
      });
    }
    
    if (meta.body) {
      if (ah.isArr(meta.body)) {
        meta.body.forEach(addToBody);  
      } else if (ah.isStr(meta.body)) {
        addToBody(meta.body);
      }
    }
    
    return sm;
  }
  
  //Create 4 grid
  function create4Grid(meta) {
    var fg = ah.ui.FourGrid();
    
    
    return fg;
  }
  
  //Create code editor
  function createCodeEditor(meta) {
    var ce = ah.ui.CodeEditor(undefined, meta);
    return ce;
  }
  
  //Create search list
  function createSearchList(meta) {
    var sl = ah.ui.SearchList();
    
    if (meta) {
      sl.load(meta.items);
    }
    
    return sl;
  }
  
  //Create embedded html
  function createEmbeddedHTML(meta) {
    var h = ah.ui.EmbeddedHTML();
    
    if (meta && meta.url) {
      h.load(meta.url);
    }
    
    return h;
  }
  
  /////////////////////////////////////////////////////////////////////////////
  
  ah.ui.partFactory = {
    toolbar: createToolbar,
    filemenu: createFMenu,
    window: createWindow,
    propertygrid: createPGrid,
    ctxmenu: createCTX,
    accordian: createAccordion,
    tabcontrol: createTabCtrl,
    list: createList,
    form: createForm,
    sidemenu: createSideMenu,
    fourgrid: create4Grid,
    codeeditor: createCodeEditor,
    searchlist: createSearchList,
    html: createEmbeddedHTML
  };
})();
