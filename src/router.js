var qs = require('querystring');

var Router = function() {
  var self = this;

  this._routes = {};

  var _applyRoute = function(dest, args) {
    if(!self._routes[dest])
      throw new Error('Route not defined');

    self._routes[dest](args);
  };

  window.onhashchange = function() {
    var url = window.location.hash.split('?');
    var args = qs.parse(url[1]);
    var dest = url[0].split('#')[1];

    if(!dest)
      dest = 'index';

    _applyRoute(dest, args);
  };

  window.onload = function() {
    Router.redirect('index');
  };
};

Router.prototype.addRoute = function(destination, callback) {
  if(typeof destination != 'string' || typeof callback != 'function')
    throw new Error('Invalid arguments');

  this._routes[destination] = callback;
};

Router.redirect = function(dest) {
  window.location.hash = dest;
};

module.exports = Router;
