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
