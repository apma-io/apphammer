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

////////////////////////////////////////////////////////////////////////////////
// Returns true/false based on whether or not what is a null/undefined value.
ah.isNull = function (what) {
  return (typeof what === 'undefined' || what == null);
};

////////////////////////////////////////////////////////////////////////////////
// Returns true if what is a string.
ah.isStr = function (what) {
  return (typeof what === 'string' || what instanceof String);
};

////////////////////////////////////////////////////////////////////////////////
// Returns true if what is a number
ah.isNum = function(what) {
  return !isNaN(parseFloat(what)) && isFinite(what);
};

////////////////////////////////////////////////////////////////////////////////
// Returns true if what is a function
ah.isFn = function (what) {
  return (what && (typeof what === 'function') || (what instanceof Function));
};

////////////////////////////////////////////////////////////////////////////////
//Returns true if what is an array
ah.isArr = function (what) {
  return (!ah.isNull(what) && what.constructor.toString().indexOf("Array") > -1);
};

////////////////////////////////////////////////////////////////////////////////
// Returns true if what is a bool
ah.isBool = function (what) {
  return (what === true || what === false);
};

////////////////////////////////////////////////////////////////////////////////
// Returns true if what is a basic type 
ah.isBasic = function (what) {
   return !ah.isArr(what) && (ah.isStr(what) || ah.isNum(what) || ah.isBool(what) || ah.isFn(what));
};

////////////////////////////////////////////////////////////////////////////////
// Convert a string to a bool
ah.toBool = function (v) {
  return (v === true || v === 'true' || v === 'y' || v === 'yes' || v === 'on' || v == '1');
};

////////////////////////////////////////////////////////////////////////////////
// Return the highest number of n numbers
ah.max = function () {
  var max = -99999999
  ;

  (Array.prototype.slice.call(arguments)).forEach(function (o) {
    if (o > max) {
      max = o;
    }
  });

  return max;
};
