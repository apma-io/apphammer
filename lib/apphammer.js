/******************************************************************************

  Copyright, 2015 - IQumulus LLC.
  All rights reserved.

******************************************************************************/

var ss = require('./syncstore.js'),
    fs = require('fs'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    expressLess = require('express-less'),
    log = require('./logger.js').log,
    index = 'no index loaded',
    jsIncludeString = '',
    cssIncludeString = '',
    DEF_PORT = 3004
;

app.get('/test', function (req, res) {
  res.send('Hello world!');
});

app.use('/dependencies', express.static(__dirname + '/../dependencies'));

//Set up authentication on sockets
io.set('authorization', function (handshakeData, accept) {
  //Should use handshakeData.headers.cookie

  //This is how to not accept:
  //return accept('Permission denied!', false);

  return accept(null, true);
});

app.get('/', function (req, res) {
   res.setHeader('Content-Type', 'text/html');
   res.send(index);
});

///////////////////////////////////////////////////////////////////////////////

function addStaticPath(name, path) {
  app.use(name, express.static(path));
}

function loadIndex(filename) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      log(0, 'error loading indexx:', err);
    } else if (typeof data !== 'undefined') {
      index = (data || '').toString().
        replace('<!-- JS INCLUDES -->', jsIncludeString).
        replace('<!-- CSS INCLUDES -->', cssIncludeString)
      ;
    }
  });  
}

function buildProd() {
  var exec = require('child_process').exec,
      child;

  log(2, 'starting bakor build');
  child = exec('bakor', {cwd: __dirname + '/../'},
    function (error, stdout, stderr) {
      var r = stdout.split('\n');
      //console.log('stdout: ' + stdout);
      r.forEach(function (str) {
        if (str.length > 0) {
          log(3, 'bakor:', str);      
        }
      });
      
      if (error !== null) {
        log(0, 'error building prod bundle:', error);
      } else {
        log(2, 'bakor build completed');
      }
  });
}

function setupTest() {
  log(2, 'starting apphammer in test mode');
  
  app.use('/css', expressLess(__dirname + '/../less', {
    debug: true
  }));
  
  app.use('/src', express.static(__dirname + '/../src'));
  
  app.use('/tests/', express.static(__dirname + '/../tests'));
  
  loadIndex(__dirname + '/../html/test.html');
 
}

function setupProd() {
  log(2, 'starting apphammer in prod mode');
  
  //Serve up the build folder
  app.use('/ah', express.static(__dirname + '/../build'));
  buildProd();
  
  loadIndex(__dirname + '/../html/prod.html');
}

function loadIncludes(jslist, csslist, fn) {
  loadJSIncludes(jslist, function () {
    loadCssIncludes(csslist, fn);
  });
}

function loadJSIncludes(list, fn) {
  log(3, 'Injecting JS includes');
  
  jsIncludeString = '';
  
  function doAdd(inc) {
    if (inc.indexOf('.js') > 0) {
      jsIncludeString += '<script src="' + inc + '"></script>\n';
    }
  }
  
  if (list) {
    list.forEach(function (inc) {
      var files = [];    
      if (inc[inc.length - 1] !== '/') {
        log(3, '  JS include: adding', inc);
        doAdd(inc);
      } else {
        //Need to read an entire directory..
        try {
          files = fs.readdirSync(__dirname + '/' + inc);
          files.forEach(function (f) {
            doAdd(inc + f);
          });
        } catch (e) {
          
        }
      } 
    });
  }
  
  log(3, 'JS include TOC loaded and generated');
  
  if (fn) {
    fn();
  }
}

function loadCssIncludes(list, fn) {
  log(3, 'Injecting CSS includes');
  if (list) {
    list.forEach(function (inc) {
      if (inc.indexOf('.css') > 0) {
        log(3, '  CSS include: adding', inc);
        cssIncludeString += '<link href="' + inc + '" rel="stylesheet" type="text/css"/>';
      }
    });
  }
  log(3, 'CSS Includes loaded');
  if (fn) {
    fn();
  } 
}

function start(cfg) {
  cfg = cfg || {
    port: DEF_PORT,
    env: 'test',
    frontend: {
      cssIncludes: [],
      jsIncludes: []
    }
  };
  
  //Check includes
  cfg.frontend = cfg.frontend || {
     jsIncludes: [],
     cssIncludes: []
  };
  
  
  loadIncludes(cfg.frontend.jsIncludes, cfg.frontend.cssIncludes, function () {
    
    if (cfg.env === 'prod') {
      setupProd();
    } else {
      setupTest();
    }
    
    log(2, 'listening to port', cfg.port || DEF_PORT);
  
    server.listen(cfg.port || DEF_PORT);  
  });
  
}

function createSyncStore(name) {
  return ss.Create(io, app, name);
}

///////////////////////////////////////////////////////////////////////////////

module.exports = {
  start: start,
  SyncStore: createSyncStore,
  ssUse: ss.addMetaPath,
  logger: require('./logger.js'),
  bakorBuild: buildProd,
  addStaticPath: addStaticPath,

  io: io,
  app: app
};
