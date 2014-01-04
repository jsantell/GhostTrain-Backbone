// Global deps
if (typeof window === 'object')
  global.$ = require('jquery')(window)
global._ = require('underscore');
global.Backbone = require('backbone');

// Include legacy support
require('ghosttrain/legacy');
