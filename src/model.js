// this enables Object.observe polyfill
require('../lib/observe');
var http = require('http');
var qs = require('querystring');

var _hostname = location.hostname;
var _port = location.port;
var _basepath = '/' + location.pathname.split('/')[1] + '/';

var _doRequest = function(method, model, onMessageCallback, onErrorCallback) {
  var data = qs.stringify(model);

  var options = {
    hostname: _hostname,
    port: _port,
    path: _basepath + model.constructor.name.toLowerCase() + '?' + data,
    method: method
  };

  var _onResponse = function(response) {
  };

  var request = http.request(options, _onResponse);
  request.end();
};

var Model = function() {};

Model.extend = function(className) {
  var _childConstructor = function() {
    var self = this;
    var className = this.constructor.name;

    var _updateField = function(evt) {
      if(evt.target.className.indexOf(className) > -1 && evt.target.dataset.store)
        self[evt.target.dataset.store] = evt.target.value;
    };

    var _updateDOM = function(changes) {
      for(var index in changes) {
        var change = changes[index];
        var queryString = '.' + className + '[data-view="' + change.name + '"]';
        var DOM = document.querySelector(queryString);
        if(DOM)
          DOM.textContent = change.object[change.name];
      }

    };
    document.addEventListener('input', _updateField);
    Object.observe(this, _updateDOM);
  };

  var notEval = eval;
  var child = notEval(_childConstructor.toString().replace('function', 'function ' + className) + '; ' + className);
  child.prototype = new Model();
  child.prototype.constructor = child;

  return child;
};

module.exports = Model;
