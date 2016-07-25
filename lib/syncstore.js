/******************************************************************************

  Copyright, 2015 - IQumulus LLC.
  All rights reserved.

******************************************************************************/

/*
  Namespaces are used for sync store communication.
  Each store has their own namespace, the name of which is the 
  name of the resource the store is connected to.

  Clients are also divided into rooms based on the app
  that they're connected to.

  Note that this object only propagates stuff, and 
  that event listeners needs to be attached to it 
  in order to actually store the data.

  Event listeners can be added using the on function.

  Three events are emitted:
    - insert
    - update
    - delete

  All three emits three arguments:
    - name: the name of the resource
    - room id (i.e. appid)
    - data: the data as received by the client

  ARGUMENTS:
  sio - socket io object
  name - the name of the sync store resource (used for getting the meta)
  express - the express app instance
*/
function SyncStore(sio, express, name, authFn) {
  var io = false,
      log = require('./logger.js').log,
      events = require('./events.js')(),
      auth = authFn || function (s, a) {
        return a(null, true);
      }
  ;

  //Set up a rest pull path
  function setupExpressPath() {
    express.get('/ss/' + name, function (req, res) {
      res.send({
        ok: true,
        data: []
      });
    });
  }

  //Set up subscriptions - called on construction
  function setupIO() {
    io = sio.of('/' + name);

    //Authentication
    io.use(auth);

    io.on('connection', function(socket) {
      //Need to figure out which room to join
      var roomid = 0,
          sender = {
            socket: socket,
            room: roomid
          }
      ;

      //console.log('client connected to room ', roomid);
      log(3, 'syncstore:', name, '- client connected to room', roomid);
      socket.join(roomid);

      socket.on('insert', function (data) {
        insert(sender, data);
        log(4, 'syncstore:', name, '- client doing insert in room', roomid, '\n', JSON.stringify(data, undefined, '\t'));
      });

      socket.on('update', function (data) {
        update(sender, data);
        log(4, 'syncstore:', name, '- client doing update in room', roomid, '\n', JSON.stringify(data, undefined, '\t'));
      });

      socket.on('delete', function (data) {
        remove(sender, data);
        log(4, 'syncstore:', name, '- client doing delete in room', roomid, '\n', JSON.stringify(data, undefined, '\t'));
      });
    });
    
    log(2, 'syncstore:', name, '- ready for socket.io connections');
  }

  //CRUD///////////////////////////////////////////////////////////////////////
  
  function insert(sender, data) {
    events.emit('insert', name, sender.room, data);
    sender.socket.broadcast.to(sender.room).emit('insert', data);
    log(4, 'syncstore:', name, '- propagating insert in room', sender.room, '\n', JSON.stringify(data, undefined, '\t'));
  }

  function update(sender, data) {
    events.emit('update', name, sender.room, data);
    sender.socket.broadcast.to(sender.room).emit('update', data);
    log(4, 'syncstore:', name, '- propagating update in room', sender.room, '\n', JSON.stringify(data, undefined, '\t'));
  }

  function remove(sender, data) {
    events.emit('delete', name, sender.room, data);
    sender.socket.broadcast.to(sender.room).emit('delete', data);
    log(4, 'syncstore:', name, '- propagating remove in room', sender.room, '\n', JSON.stringify(data, undefined, '\t'));
  }

  /////////////////////////////////////////////////////////////////////////////

  //log(2, 'syncstore:', name, 'created');
  
  setupIO();
  setupExpressPath();

  return {
    on: events.on
  }
};

module.exports = {
  Create: SyncStore
};
