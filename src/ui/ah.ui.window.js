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

  var focusedWindow = false;

  ah.ui.Window = function (attributes) {
    var properties = ah.merge({
          title: 'MY WINDOW',
          width: 500,
          height: 200,
          x: 0,
          y: 0,

          canMove: true,
          canResize: true,
          canMaximize: true,
          canClose: true,
          
          isModal: false,
          
          center: false,

          scrollY: false,
          scrollX: false,    

          leftIcons: [],
          rightIcons: []
        }, attributes),
        containerNode = ah.dom.cr('div', 'ah-window'),
        titlebarNode = ah.dom.cr('div', 'ah-noselection titlebar'),
        leftIconNode = ah.dom.cr('div', 'iconbar left'),
        rightIconNode = ah.dom.cr('div', 'iconbar right'),
        bodyNode = ah.dom.cr('div', 'body ah-prettyscroll', ''),
        resizeHandle = ah.dom.cr('div', 'ah-transition resize-handle'),
        titleNode = ah.dom.cr('span', 'win-title', properties.title),
        events = ah.events(),
        visible = true,
        maximized = false,
        mover = ah.Mover(titlebarNode, containerNode),
        sizer = ah.Resizer(resizeHandle, containerNode)
    ;

    // if (attributes) {
    //   Object.keys(attributes).forEach(function (key) {
    //     if (properties[key]) {
    //       properties[key] = attributes[key];
    //     }
    //   });
    // }

    titleNode.innerHTML = properties.title;
    
    ah.dom.style(bodyNode, {
        'overflow-x': properties.scrollX ? 'auto' : 'hidden'
    });
    
    ah.dom.style(bodyNode, {
      'overflow-y': properties.scrollY ? 'auto' : 'hidden'
    });

    /////////////////////////////////////////////////////////////////////////////

    //Center the window
    function center() {
      var s = ah.dom.size(document.body);
      properties.x = (s.w / 2) - (properties.width / 2);
      properties.y = (s.h / 2) - (properties.height / 2);
      
      ah.dom.style(containerNode, {
        width: properties.width + 'px',
        height: properties.height + 'px',
        left: properties.x + 'px',
        top: properties.y + 'px'
      });
    }

    //Add the icons
    function addIcons() {
      leftIconNode.innerHTML = '';
      rightIconNode.innerHTML = '';

      //Add the closer/maximizer first
      properties.rightIcons = [
        {icon: 'circle', iconclass: 'closecolor', fn: hide}
      ].concat(properties.rightIcons);

      if (properties.canMaximize) {
        properties.rightIcons = [
          {icon: 'circle', iconclass: 'maximizecolor', fn: toggleMaximized}
        ].concat(properties.rightIcons);
      }

      properties.leftIcons.forEach(function (icon) {
        var i = ah.dom.cr('span', 'ah-transition icon fa fa-' + icon.icon);
        if (icon.iconclass) {
          i.className += ' ' + icon.iconclass;
        }
        ah.dom.on(i, 'click', icon.fn);
        ah.dom.ap(leftIconNode, i);
      });

      properties.rightIcons.forEach(function (icon) {
        var i = ah.dom.cr('span', 'ah-transition icon fa fa-' + icon.icon);
        if (icon.iconclass) {
          i.className += ' ' + icon.iconclass;
        }
        ah.dom.on(i, 'click', icon.fn);
        ah.dom.ap(rightIconNode, i);
      });
    }

    //Resize the body to accommodate the total height/width
    function refresh() {
      var vp = ah.dom.size(containerNode),
          tb = ah.dom.size(titlebarNode)
      ;

      ah.dom.style(bodyNode, {
        width: '100%',
        height: vp.h - tb.h + 'px'
      });
    }

    //Maximize the window
    function maximize() {
      var vp = ah.dom.size(document.body);

      sizer.disable();

     // if (!maximized) {
        ah.dom.style(containerNode, {
          width: '100%',
          height: '100%',
          left: '0px',
          top: '0px',
          zIndex: 10,
          'transition':'0.5s ease all', 
          '-moz-transition':'0.5s ease all',
          '-webkit-transition':'0.5s ease all'
        });

        setTimeout(function () {
          refresh();
          events.emit('Resize');
          events.emit('AfterResize');
        }, 500);

        ah.dom.style(resizeHandle, {
          display: 'none'
        });

        refresh();

        mover.disable();

        maximized = true;
        events.emit('Maximize');

    //  }
    }

    //Restore the window to its pre-fullscreen state
    function restore() {
      //if (maximized) {

        ah.dom.style(containerNode, {
          width: properties.width + 'px',
          height: properties.height + 'px',
          left: properties.x + 'px',
          top: properties.y + 'px',
          zIndex: 5
        });

        setTimeout(function () {
          ah.dom.style(containerNode, {
            'transition':'none', 
            '-moz-transition':'none',
            '-webkit-transition':'none'
          });

          if (properties.canMove) {
            mover.enable();
          }

          if (properties.canResize) {
            sizer.enable();
            ah.dom.style(resizeHandle, {
              display: ''
            });
            refresh();
          }

          events.emit('Resize');
          events.emit('AfterResize');

        }, 500);

        maximized = false;
        events.emit('Restored');
       
     // }
    }

    function toggleMaximized() {
      if (maximized) {
        restore();
      } else {
        maximize();
      }
    }

    //Center the window on the screen
    function centerWindow() {

    }

    //Hide the window
    function hide() {
      if (visible) {
        visible = false;

        /*ah.dom.style(bodyNode, {
          opacity: 0
        });*/

        ah.dom.style(containerNode, {
          visibility: 'hidden',
          opacity: 0          
        });
        
        events.emit('Hide');
      }
      
      if (properties.isModal) {
        ah.cancelCatcher();
      }
    }

    //Show the window
    function show() {
      if (visible) {
        return;
      }

      if (!visible) {
        visible = true;

       /* ah.dom.style(bodyNode, {
          opacity: 1
        });*/

        ah.dom.style(containerNode, {
          visibility: 'visible',
          opacity: 1
        });

        events.emit('Show');
      }
      
      if (properties.isModal) {
        ah.dom.style(containerNode, {
          zIndex: 100
        });
        
        ah.catcher(true, hide);
      }
      
      if (properties.isModal && properties.center) {
        center();
      }

      focus();
    }

    //Toggle the window
    function toggle() {
      visible = !visible;
      if (visible) {
        show();
      } else {
        hide();
      }
    }

    //Destroys the window completely
    function destroy() {
      if (containerNode.parentNode) {
        containerNode.innerHTML = '';
        containerNode.parentNode.removeChild(containerNode);
      }
    }

    /////////////////////////////////////////////////////////////////////////////

    ah.ready(function () {
      //Build the hierarchy 
      ah.dom.ap(document.body,
        ah.dom.ap(containerNode,
          ah.dom.ap(titlebarNode,
            rightIconNode,
            leftIconNode,
            titleNode
          ),
          bodyNode,
          resizeHandle
        )
      );

      if (properties.center) {
        center();
      }
      
      refresh();
    });

    ah.dom.style(containerNode, {
      width: properties.width + 'px',
      height: properties.height + 'px',
      left: properties.x + 'px',
      top: properties.y + 'px'
    });

    addIcons();

    mover.on('Done', function (x, y) {
      properties.x = x;
      properties.y = y;
    });

    sizer.on('Done', function (w, h) {
      properties.width = w;
      properties.height = h;
      refresh();
      events.emit('AfterResize');
    });

    sizer.on('Resizing', function () {
      refresh();
      events.emit('Resize');
    });

    function focus() {
      if (focusedWindow) {
        ah.dom.style(focusedWindow, {
          zIndex: 5
        });
      } 
      
      ah.dom.style(containerNode, {
        zIndex: properties.isModal ? 100 : 6
      });
      
      focusedWindow = containerNode;
    }

    ah.dom.on(containerNode, 'mousedown', function () {
      if (maximized) {
        return;
      }

      focus();

    });

    ah.dom.on(titlebarNode, 'dblclick', function () {
      if (properties.canMaximize) {
        toggleMaximized();
      }
    });

    if (!properties.canResize) {
      ah.dom.style(resizeHandle, {
        display: 'none'
      });
      sizer.disable();
    }

    if (!properties.canMove) {
      mover.disable();
    }

    refresh();
    hide();

    /////////////////////////////////////////////////////////////////////////////
    //Public interface
    return {
      container: containerNode,
      body: bodyNode,
      on: events.on,
      maximize: maximize,
      restore: restore,
      toggleMaximized: toggleMaximized,
      centerWindow: center,
      hide: hide,
      show: show,
      toggle: toggle,
      destroy: destroy,
      setTitle: function (t) {
        titleNode.innerHTML = t;
      },
      visible: function () {
        return visible;
      }
    };
  };
})();
