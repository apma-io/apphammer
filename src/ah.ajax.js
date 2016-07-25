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

ah.ajax = function (p) {
  var props = ah.deepmerge({
        url: false,
        type: 'GET',
        success: function () {},
        error: function () {},
        data: {}
      }, p),
      r = new XMLHttpRequest();
  ;
    
  if (!props.url) return;
  
  // if (mp.auth.token()) {
  //   props.url = props.url + '?token=' + mp.auth.token();
  // }
  
  r.open(props.type, props.url, true);
  r.setRequestHeader('Content-Type', 'application/json');

  r.onreadystatechange = function () {
    if (r.readyState === 4 && r.status === 200) {      
      try {
        var json = JSON.parse(r.responseText);
        if (json.ok === false) {
          return props.error(json);
        } 
        props.success(json);        
      } catch(e) {
        props.success(r.responseText);
      }      
    } else if (r.readyState === 4) {
      props.error(r.statusText);
    }
  };
  
  try {
    r.send(JSON.stringify(props.data));            
  } catch (e) {
    r.send(props.data || true);      
  }
};
