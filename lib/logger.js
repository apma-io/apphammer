/******************************************************************************

  Copyright, 2015 - IQumulus LLC.
  All rights reserved.

******************************************************************************/
var levels = [
      'error',
      'warning',
      'notice',
      'silly',
      'insane',
      'batcrazy'
    ],
    col = [
      'red',
      'purple',
      'blue',
      'white',
      'white',
      'white'
    ],
    colors = require('colors'),
    currentLevel = 4,
    logToFile = false,
    logDest = '~/.apphammer/',
    logFile = logDest + (new Date()).getTime() + '.log',
    fs = require('fs')
;

function pad(str) {
  var l = str.length;
  if (l < 12) {
    for (var i = l; i < 12; i++) {
      str += '.';
    }
  }
  return str;
}

module.exports = {
  log: function (level) {
    var args = Array.prototype.slice.call(arguments),
        str = '',
        ts = '',
        d = new Date()
    ;
    
    if (level > currentLevel) {
      return;
    }
    
    args.splice(0, 1);
    
    ts = ('[' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + '] ');
   
    str += pad(levels[level]);
    args.forEach(function (s, i) {
      if (i > 0) str += ' ';
      str += s;
    });
    
    console.log(ts.yellow + str[col[level]]);
    
    if (logToFile) {
      fs.appendFile(logFile, ts + str + '\n', function (err) {
        if (err) {
          //Well crap.
          console.log('FATAL ERROR'.red + ': unable to write to log file! File logging disabled! Details: ' + err.toString().bold);
          logToFile = false;
        }
      });      
    }      	     	
  },
  setLevel: function (lvl) {
    currentLevel = lvl || 0;
  },
  setLogDest: function (path) {
    logDest = path;
    logFile = logDest + (new Date()).getTime() + '.log';
  },
  setLogToFile: function (flag) {
    logToFile = flag;
  }
};
