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
  var funcs = [], hasInited = false;

  if (typeof window['ah'] !== 'undefined') {
    throw 'Error: ah object already exists!';
  }

  //Add a new post-init function 
  function ready(fn) {
    if (hasInited) {
      fn();
    } else {
      funcs.push(fn);      
    }
  }

  //Initialize the hammer
  function init() {
    hasInited = true;
    funcs.forEach(function (fn) {
      fn();
    });
    funcs = [];
  }

  function merge(a, b) {
    a = a || {};
    Object.keys(b || {}).forEach(function (bk) {
      if (ah.isNull(a[bk]) || ah.isBasic(a[bk])) {
        a[bk] = b[bk];
      } else if (!ah.isBasic(a[bk])) {
        merge(a[bk], b[bk]);
      }
    });
    return a;
  }
  
  //Perform a deep merge between a and b (union merge)
  function deepmerge(a, b) {
    if (!a || !b) return a || b;    
    Object.keys(b).forEach(function (bk) {
    if (ah.isNull(b[bk]) || ah.isBasic(b[bk])) {
        a[bk] = b[bk];
    } else if (ah.isArr(b[bk])) {
      
      a[bk] = [];
      
      b[bk].forEach(function (i) {
        if (ah.isNull(i) || ah.isBasic(i)) {
          a[bk].push(i);
        } else {
          a[bk].push(ah.merge({}, i));
        }
      });
      
    } else {
        a[bk] = ah.merge({}, b[bk]);
      }
    });    
    return a;
  }

  /////////////////////////////////////////////////////////////////////////////
  //Public Interface

  window.ah = {
    init: init,
    ready: ready,
    merge: merge,
    deepmerge: deepmerge,
    ui: {}
  };
  
})();
