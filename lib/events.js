/******************************************************************************

  Copyright, 2015 - IQumulus LLC.
  All rights reserved.

******************************************************************************/

module.exports = function () {
  var listeners = {}
  ;

  //////////////////////////////////////////////////////////////////////////////
  //Emit an event
  function emit (which) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 1);
    
    if (listeners[which]) {
      listeners[which].forEach(function (listener) {
        listener.fn.apply(listener.ctx, args);
      });
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //Clear events
  function clear() {
    listeners = {};
  }

  //////////////////////////////////////////////////////////////////////////////
  //Bind 
  /*
    Returns a function that can be called to unbind the event
  */
  function on(evnt, fn) {
    var id = uuid.v4(),
        s = []
    ;

    //Handle binding multiple things to the same event
    if (evnt && evnt.forEach) {
      evnt.forEach(function (v) {
        s.push(on(v, fn));
      });
      return function () {
        s.forEach(function (f) {
          f();
        });
      };
    }

    listeners[evnt] = listeners[evnt] || [];

    listeners[evnt].push({
      id: id,
      fn: fn
    });

    return function () {
      listeners[evnt] = listeners[evnt].filter(function (b) {
        return b.id !== id;
      });
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // Return public interface
  return {
    emit: emit,
    on: on,
    clear: clear
  };
};
