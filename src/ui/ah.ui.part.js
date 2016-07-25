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
  var parts = {},
      creationQueue = {},
      preParts = {}
  ;
  
  /////////////////////////////////////////////////////////////////////////////

  
  /////////////////////////////////////////////////////////////////////////////
  
  //Returns a reference to a part
  function strpart(p, fn) {
    if (!ah.isNull(parts[p])) {
      if (ah.isFn(fn)) {
        fn(parts[p]);
      }
      return parts[p];   
    } else if (ah.isFn(fn)) {
      //The referenced object has not yet been created.
      //We should push it to a queue and call fn when it's created.
      //This allows us to load the parts in any order.
      creationQueue[p] = creationQueue[p] || [];
      creationQueue[p].push(fn);
    }
    return false;
  }
  
  //Create a new part
  function crPart(p) {
    var blank = function () {return false;},
        obj = ah.ui.partFactory[p.type] ? ah.ui.partFactory[p.type](p) : {} 
    ;  
    
    if (!ah.isNull(parts[p.name])) {
      ah.snackBar('Error: part ' + p.name + ' already exists!');
      return false;
    }
    
    parts[p.name] = ah.merge({
      //Activate the part
      activate: obj.show || blank,
      //Patch the part - used for extension
      patch: blank 
    }, obj);
    
    if (p && p.events && ah.isFn(obj.on)) {
      Object.keys(p.events).forEach(function (e) {
         if (ah.isFn(p.events[e])) {
           obj.on(e, p.events[e]);
         }
      });
    }
    
    //Check the creation queue
    if (creationQueue[p.name]) {
      creationQueue[p.name].forEach(function(fn) {
        fn(parts[p.name]);
      });
      creationQueue[p.name] = [];
    }
    
  }
  
  function loadQueue() {
    Object.keys(preParts).forEach(function (name) {
      crPart(preParts[name]);    	
    });
  }
  
  //Do the loadQueue when initializing 
  ah.ready(loadQueue);
  
  /////////////////////////////////////////////////////////////////////////////
  
  ah.ui.part = function (p, fn) {
    if (ah.isStr(p)) {
      return strpart(p, fn);  
    } else if (!ah.isNull(p)) {
      preParts[p.name] = p;
      //return crPart(p);
    }
  };
  
  //Patch a part
  ah.ui.partPatch = function (name, obj) {
    if (!ah.isNull(preParts[name])) {
      //Do a deep merge
      ah.merge(preParts[name], obj);
    }
  };
  
  //Returns a delegator function
  /*
    Allows for binding to functions on parts that aren't 
    created yet.
  */
  ah.ui.partFn = function (name, fn) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 2);
    
    return function () {
      if (parts[name] && ah.isFn(parts[name][fn])) {
        parts[name][fn].apply(undefined, arguments);
      }
    }
  };
  
})();
