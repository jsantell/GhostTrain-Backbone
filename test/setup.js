// Global deps

// Include jQuery if we're in a browser environment
// Use < 2.x.x if on IE8 or what
if (typeof document === 'object') {
    if (document.addEventListener)
      global.$ = require('jquery')(window)
  else
    global.$ = require('./resources/jquery-1.10.2');
}
global._ = require('underscore');
global.Backbone = require('backbone');

// Include legacy support
require('ghosttrain/legacy');
