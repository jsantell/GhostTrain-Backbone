var utils = require('./lib/utils');

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
  return function sync (method, model, options) {
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
  };
};

