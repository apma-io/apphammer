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

ah.ui.FourGrid = function(parent) {
  var container = ah.dom.cr('div', 'ah-fourgrid'),
      events = ah.events(),
      horSplitter = ah.dom.cr('div', 'ah-splitter-hor ah-transition-color'),
      verSplitter = ah.dom.cr('div', 'ah-splitter-ver ah-transition-color'),
      panelUL = ah.dom.cr('div', 'panel'),
      panelUR = ah.dom.cr('div', 'panel'),
      panelBL = ah.dom.cr('div', 'panel'),
      panelBR = ah.dom.cr('div', 'panel'),
      top = ah.dom.cr('div'),
      bottom = ah.dom.cr('div'),
      verMover = ah.Mover(verSplitter, verSplitter, 'X'),
      horMover = ah.Mover(horSplitter, horSplitter, 'Y'),
      panels = []
  ;
  
  //Reset
  function reset() {
    var s = ah.dom.size(container);
    ah.dom.style(horSplitter, {
      left: '0px',
      top: (s.h / 2) - 2 + 'px'
    });
    
    ah.dom.style(verSplitter, {
      left: (s.w / 2) - 2 + 'px',
      top: 'px'
    });
    
    resize();
  }

  //Resize the panels
  function resize() {
     var s = ah.dom.size(container),
         vp = {x: parseInt(verSplitter.style.left), y: parseInt(verSplitter.style.top)},
         hp = {x: parseInt(horSplitter.style.left), y: parseInt(horSplitter.style.top)}
     ;
    
    //Panel UL: width = ver.left, height = hor.top
    //Panel UR: width = ver.left - main.width, height = hor.top
    //Panel BL: width = ver.left, height = main.height - hor.top
    //Panel BR: width = main.width - ver.left, height = main.height - hor.top
    ah.dom.style(panelUL, {
       background: '#00FF00',
       width: vp.x + 'px',
       height: hp.y + 'px',
       marginRight: '4px'
    });
    
    ah.dom.style(panelUR, {
       background: '#0000FF',
       width: s.w - vp.x - 4 + 'px',
       height: hp.y + 'px'
    });
    
    ah.dom.style(panelBL, {
       background: '#00FFFF',
       width: vp.x + 'px',
       height: s.h - hp.y + 'px',
       marginRight: '4px'
    });
    
    ah.dom.style(panelBR, {
       background: '#FFFFFF',
       width: s.w - vp.x - 4  + 'px',
       height: s.h - hp.y - 4 + 'px'
    });
    
    panels.forEach(function (panel) {
       panel.resize();
    });
    
    events.emit('Resize');
  }
  
  verMover.on('Moving', resize);
  horMover.on('Moving', resize);

  //Create a panel
  function createPanel(pparent) {
    var pcontainer = ah.dom.cr('div', 'ah-stretch-vert'),
        pbody = ah.dom.cr('div', 'ah-prettyscroll'),
        ptitle = ah.dom.cr('span', 'title', '/test.js'),
        topbar = ah.dom.cr('div', 'ah-noselection titlebar'),
        pevents = ah.events(),
        left = ah.dom.cr('div', 'iconbar left'),
        right = ah.dom.cr('div', 'iconbar right'),
        maximize = ah.dom.cr('span', 'ah-transition icon fa fa-circle maximizecolor'),
        maximized = false,
        icons = [{
          icon: 'bars'
        }],
        exports = {}
    ;
    
    ah.dom.style(pbody, {
      position: 'relative'
    });
    
    icons.forEach(function (icon) {
      var icon = ah.dom.cr('span', 'ah-transition icon fa fa-' + icon.icon);
      ah.dom.on(icon, 'click', icon.click);      
      ah.dom.ap(left, icon);
    });
    
    function setTitle(t) {
      ptitle.innerHTML = t;
    }
    
    ah.dom.on(pcontainer, 'click', function () {
       pevents.emit('Select');
    });
    
    ah.dom.on(maximize, 'click', function () {
      maximized = !maximized;
      if (maximized) {
        
      } else {
        
      }
    });
    
    ah.dom.on(ptitle, 'click', function () {
      pevents.emit('TitleClick');
    });
    
    ah.dom.ap(pcontainer,
      ah.dom.ap(topbar,
        ah.dom.ap(right,
          maximize 
        ),
        left,
        ptitle
      ),
      pbody
    );
    
    function presize() {
      var cs = ah.dom.size(pcontainer),
          ts = ah.dom.size(topbar)
      ;
      ah.dom.style(pbody, {
         height: cs.h - ts.h + 'px',
         width: cs.w + 'px'
      });
    }
    
    
    if (pparent) {
      ah.dom.ap(pparent, pcontainer); 
    }
    
    exports = {
      resize: presize,
      topbar: topbar,
      body: pbody,
      container: pcontainer,
      on: pevents.on,
      setTitle: setTitle 
    };
    
    panels.push(exports);
    return exports;
  }

  /////////////////////////////////////////////////////////////////////////////
  
  ah.dom.ap(container,
    ah.dom.ap(top,
      panelUL,
      panelUR
    ),
    ah.dom.ap(bottom,
      panelBL,
      panelBR
    ),
    horSplitter,
    verSplitter
  );

  if (!ah.isNull(parent)) {
    ah.dom.ap(parent, container);
    //ah.dom.ap(container, createPanel().container);
  }
  
  reset();

  return {
    body: container,
    on: events.on,     
    resize: resize,
    reset: reset,
    
    horPos: function () {
      return {x: parseInt(horSplitter.style.left), y: parseInt(horSplitter.style.top)};
    },
    verPos: function () {
      return {x: parseInt(verSplitter.style.left), y: parseInt(verSplitter.style.top)};
    },
    
    TL: createPanel(panelUL),
    TR: createPanel(panelUR),
    BL: createPanel(panelBL),
    BR: createPanel(panelBR)
  };
};
