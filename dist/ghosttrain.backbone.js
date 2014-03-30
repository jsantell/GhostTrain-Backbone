!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.GhostTrainBackbone=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var utils = _dereq_('./lib/utils');

/**
 * GhostTrainBackbone returns a function that can be used in place of `Backbone.sync`,
 * mimicking the formatting before sending off the HTTP request but calling
 * GhostTrain's `send` instead.
 *
 * May take an optional jQuery `$` object to create a Deferred object for parity
 * with Backbone.sync, but it does not have all the properties of the JQXHR object.
 *
 * @param {GhostTrain} gt
 * @param {jQuery} $
 * @return {Function}
 */

module.exports = function (gt, $) {
  return { sync: sync };
  function sync (method, model, options) {
    // If Backbone's jQuery object passed in, use it to return a jQuery deferred
    var deferred = $ ? $.Deferred() : null;
    var type = utils.methodMap[method];

    // Default JSON-request options.
    var params = {
      type: type,
      dataType: 'json'
    };

    // Ensure that we have a URL.
    var url = options.url || (params.url = utils.getURL(model) || utils.urlError());

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    var reqOptions = {
      contentType: params.contentType,
      delay: options.delay,
      headers: options.headers,
      body: JSON.parse(params.data || '{}')
    };

    gt.request(type, url, reqOptions, function (err, res, body) {
      if (err || res.statusCode !== 200) {
        if (deferred)
          deferred.rejectWith(model, [err || body]);
        if (options.error)
          options.error.call(model, err || body);
      } else {
        if (deferred)
          deferred.resolveWith(model, [body]);
        if (options.success)
          options.success.call(model, body);
      }
    });

    return deferred; 
  }
};


},{"./lib/utils":2}],2:[function(_dereq_,module,exports){
// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
// From Backbone
var methodMap = {
  'read': 'get',
  'create': 'post',
  'update': 'put',
  'delete': 'delete'
};

exports.methodMap = methodMap;

/**
 * Throws a URL error
 */

function urlError () {
  throw new Error('A "url" property or function must be specified');
}
exports.urlError = urlError;

/**
 * Takes a Backbone model or collection and returns the URL for that
 * object.
 *
 * @params {Object} object
 * @return {String}
 */

function getURL (object) {
  return typeof object.url === 'function' ? object.url() : object.url;
}
exports.getURL = getURL;

},{}]},{},[1])
(1)
});