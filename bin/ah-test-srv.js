/******************************************************************************

  Copyright, 2015 - IQumulus LLC.
  All rights reserved.

******************************************************************************/

var ah = require(__dirname + '/../lib/apphammer.js'),
    port = 3006
;


console.log('Starting Apphammer Test Server on port ', port);
ah.start();

var ss = ah.SyncStore('test');