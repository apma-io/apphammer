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
  var activePayload = false;

  ///////////////////////////////////////////////////////////////////////////
  //Make a node draggable
  ah.Draggable = function(target, type, payload) {
    var events = ah.events(),
        callbacks = []
    ;

    target.setAttribute('draggable', true);

    callbacks.push(ah.dom.on(target, 'dragstart', function (e) {
      e.dataTransfer.effectAllowed = 'copy';

      activePayload = {
        type: type,
        payload: payload
      };

      events.emit('DragStart', e);
    }));

    callbacks.push(ah.dom.on(target, 'dragend', function (e) {
      events.emit('DragEnd', e);
    }));

    return {
      on: events.on
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  //Turn a node into a drop target
  ah.DropTarget = function(target, types) {
    var enabled,
        events = ah.events(),
        callbacks = [],
        tarray = types.split(' '),
        markerNode = ah.dom.cr('div', 'ah-transition ah-droptarget fa fa-plus-circle', 'DROP')
    ;

    function nodef(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.preventDefault();
      return false;
    } 

    function hideMarker() {
      ah.dom.style(markerNode, {
        opacity:0,
        visibility: 'hidden'
      });
    }

    function showMarker() {
      ah.dom.style(markerNode, {
        opacity:1,
        visibility: 'visible'
      });
    }

    function attach() {
      destroy();

      callbacks.push(ah.dom.on(target, 'dragenter', function (e) {
        events.emit('DragEnter');
        showMarker();
        return nodef(e);
      }));

      callbacks.push(ah.dom.on(target, 'dragleave', function (e) {
        events.emit('DragLeave');
        hideMarker();
      }));

      callbacks.push(ah.dom.on(target, 'dragover', function (e) {
        e.dataTransfer.dropEffect = 'copy';
        events.emit('DragOver');
        showMarker();
        return nodef(e);
      }));

      callbacks.push(ah.dom.on(target, 'drop', function (e) {
        if (!activePayload || types.indexOf(activePayload.type) === -1) {
          return;
        }

        hideMarker();

        //Handle it.
        events.emit('Drop', activePayload.payload);

        return nodef(e);
      }));
    }

    function enable() {
      enabled = true;
    }

    function disable() {
      enabled = false;
    }

    function destroy() {
      callbacks.forEach(function (fn) {
        fn();
      });
      callbacks = [];
    }

    ///////////////////////////////////////////////////////////////////////////

    attach();
    //ah.dom.ap(target, markerNode);

    return {
      on: events.on,
      enable: enable,
      disable: disable,
      destroy: destroy
    }
  }
})();
