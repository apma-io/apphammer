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
  var instancedStores = {}
  ;

  //SyncStore creator function
  /*
    The idea is that a SyncStore embodies a client-side database
    that is kept in sync with the server using socket.io.

    When a change comes in from the network, the store
    will emit a change event specific for a particular attribute, e.g.
    a:b:c:change

    Using the update/insert/remove API will automatically 
    sync the changes with the server, which will lead to both a 
    database save as well as a broadcast to any other clients looking
    at the data.

    The store also handles race conditions when loading.
    It does this by gathering any incoming changes in a stack whilst loading,
    and replaying it on the dataset once loading has been completed.
    For this to work, the socket.io connection must be established 
    prior to initiating loading of the application. 

    At the same time, the init event must not be emitted on the socket before 
    all the stores have been set into load mode.
    So:

    1. Connect the socket
    2. Call prepareSyncStoreLoad();
    3. Emit init
    4. Call resetSyncStores();

    This will ensure that no packets are lost while waiting for the application
    to load.
    
    TODO:
      - Add row cursor thing so that local syncing is easier

  */
  ah.SyncStore = function (resource) {
    //No dupes allowed
    if (!ah.isNull(instancedStores[resource])) {
      return instancedStores[resource];
    }
    
    var events = ah.events(),
        data = {
          'first': {
            foo: 'foo!',
            bar: 'bar!',
            what: '0'
          }
        },
        socketSubscriptions = [],
        isLoading = false,
        loadingQueue = [],
        changeFn = false,
        socket = false,
        rowCursor = false,
        exports = {}
    ;

    //Replay the loading queue, e.g. stuff coming in while loading
    function replayQueue() {
      loadingQueue.forEach(function (b) {
        if (b.type === 'write') {
          handleIncomingWrite(b);
        } else {
          remove.apply(this, b.command);
        }
      });

      loadingQueue = [];
    }

    //Handle an incoming write command - emits an attribute specific signal
    function handleIncomingWrite(data) {
      var flat = write.apply(this, data.command);
      if (flat) {
        //Emit a change event for the attribute that changed externally
        events.emit(flat + ':change', data.command[data.command.length - 1]);
      }

      if (data && data.command && data.command.length === 1) {
        events.emit('rootchange');
      }
    }

    //Connect to the sync store
    function connect(fn, url) {
      var defURL = window.location.origin;


      if (window.io) {  
        socket = io( (url || defURL) + '/' + resource);

        socket.on('connect', function () {
          socketSubscribe();

          console.log('Connected!');

          //Should do a rest pull here
          RESTPull(
            //OK
            function () {

            },
            //Error
            function (error) {
              ah.snackBar('Unable to load data source "' + resource + '"', 'RETRY', function() {

              });
            }
          );

          if (ah.isFn(fn)) {
            fn();
          }
        });

        socket.on('disconnect', function () {

        });
      }
    }

    //Set up subscription
    function socketSubscribe() {
      //We only need to subscribe to two messages:
      // <resource>:write
      // <resource>:remove

      loadingQueue = [];

      socketSubscriptions = socketSubscriptions.filter(function (fn) { 
        //fn(); 
        return false;
      });

      socketSubscriptions.push(socket.on('update', function (data) {
        if (data && data.command && data.command.length > 1) {
          if (isLoading) {
            loadingQueue.push({type: 'update', command: data.command});
          } else {
            handleIncomingWrite(data);
          }
        }
      }));

      socketSubscriptions.push(socket.on('insert', function (data) {
        if (data && data.command && data.command.length > 1) {
          if (isLoading) {
            loadingQueue.push({type: 'write', command: data.command});
          } else {
            handleIncomingWrite(data);
          }
        }
      }));

      socketSubscriptions.push(socket.on('delete', function (data) {
        if (data && data.command) {
          if (isLoading) {
            loadingQueue.push({type: 'delete', command: data.command});
          } else {
            remove.apply(this, data.command);
          }
        }
      }));
    }

    //Find the value based on a set of keys
    function find(keys, fn) {
      var l,
          o,
          ol,
          flat
      ;

      if (keys.length > 0) {
        ol = o = data[keys[0]] = data[keys[0]] || {};

        if (keys.length === 1) {
          fn(data, keys[0]);
          return keys[0];
        }
        
        flat = keys[0];
        l = keys[keys.length - 1];

        keys.splice(0, 1);

        keys.forEach(function (a) {
          ol = o;
          flat = flat + ':' + a;
          o = o[a] = o[a] || {};
        });

        if (ol && fn) {
          fn(ol, l, flat);
          return flat;
        }
      }
      return false;
    }

    //Delete a value
    function del() {
      var args = Array.prototype.slice.call(arguments);
      return find(args, function (o, k) {
        delete o[k];
        doChange();
      });
    }

    //Write a value to the resource object
    /*
      Accepts [2..n] arguments.
      Last argument is the value to write
    */
    function write() {

      var args = Array.prototype.slice.call(arguments),
          value = args[args.length - 1]
      ;

      if (args.length > 1) {
        args.splice(args.length - 1, 1);
        
        return find(args, function (o, key, flat) {
          o[key] = value;
          doChange();
        });
      }
    }

    //Read a value
    function read() {
      var args = Array.prototype.slice.call(arguments),
          value
      ;

      find(args, function (o, k) {
        value = o[k];
      });

      return value || false;
    }

    //Do a traditional REST fetch
    function RESTPull(ok, error) {
     //prepareLoad();

      //Do the load; call replayQueue(); when done.
    }

    ////////////////////////////////////////////////////////////////////////////
    //These are special public functions that wrap the above and add socket stuff.

    //Apply a change: this is the public interface and will result in a socket e.
    function change() {
      if (write.apply(this, arguments) && socket) {
        //We need to emit a change event here.
        socket.emit('update', {
          command: Array.prototype.slice.call(arguments)
        });

        events.emit('Update', Array.prototype.slice.call(arguments));
        //console.log(data);
        return true;
      }
      return false;
    }

    function insert() {
      if (write.apply(this, arguments) && socket) {
        //We need to emit a change event here.
        socket.emit('insert', {
          command: Array.prototype.slice.call(arguments)
        });
        events.emit('Insert', Array.prototype.slice.call(arguments));
        //console.log(data);
        return true;
      }
      return false;
    }

    //Remove entry
    function remove() {
      if (del.apply(this, arguments) && socket) {
        //We need to emit a change event here.
        socket.emit('delete', {
          command: Array.prototype.slice.call(arguments)
        });
        events.emit('Delete', Array.prototype.slice.call(arguments));
        return true;
      }
      return false;
    }

    //Iterate through the outer
    function forEach(fn) {
      if (ah.isArr(data)) {
        data.forEach(fn);
      } else {
        Object.keys(data).forEach(function (key) {
          fn(data[key], key);
        });
      }
    }

    //Activate queuing mode
    function prepareLoad() {
      isLoading = true;
    }

    function changeStrategy(fn) {
      changeFn = fn;
    }

    function doChange() {
      if (ah.isFn(changeFn)) {
        changeFn(data);
      }
      events.emit('Change');
    }

    function gotoRow(r) {
      rowCursor = r;
      events.emit('RowGoto');
    }
    
    function currRow() {
      return rowCursor;
    }

    //Public interface
    exports = {
      on: events.on,
      read: read,
      update: change,
      insert: insert,
      remove: remove,
      forEach: forEach,
      //RESTPull: RESTPull,
      connect: connect,
      changeStrategy: changeStrategy,
      
      //Move the cursor
      gotoRow: gotoRow,
      currRow: currRow
    };
    
    instancedStores[resource] = exports;
    
    return exports;
  }

})();
