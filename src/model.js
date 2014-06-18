// this enables Object.observe polyfill
require('../lib/observe');

var Model = function() {
};

Model.extend = function(className) {
  var child = function() {
    Model.call(this);

    var self = this;

    var _updateField = function(evt) {
      if(evt.target.className.indexOf(className) > -1 && evt.target.dataset.store)
        self[evt.target.dataset.store] = evt.target.value;
    };

    var _updateDOM = function(changes) {
      for(var index in changes) {
        var change = changes[index];
        var queryString = '.' + className + '[data-store="' + change.name + '"]';
        var DOM = document.querySelector(queryString);
        if(DOM)
          DOM.textContent = change.object[change.name];
      }
    
    };

    document.addEventListener('input', _updateField);
    Object.observe(this, _updateDOM);
  };

  child.prototype = new Model();
  child.prototype.constructor = child;

  return child;
};

module.exports = Model;
