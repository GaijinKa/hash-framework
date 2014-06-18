var chai = require('chai');
var should = chai.should();

var Model = require('../src/model');

describe('The framework model', function(done) {

  beforeEach(function(done) {
    global.document = {
      addEventListener: function(name, callback) {},
      querySelector: function(query) {}
    };
    done();
  });

  afterEach(function(done) {
    delete global.document;
    done();
  });

  it('should provide extend method', function(done) {
    Model.prototype.isDone = function() {
      done();
    };

    var child = Model.extend();
    var childInstance = new child();
    childInstance.isDone();
  });

  it('should register an input listener', function(done) {
    var child = Model.extend();

    global.document.addEventListener = function(name, callback) {
      name.should.be.equal('input');
      callback.should.be.a('function');
      done();
    };

    var uut = new child();
  });

  it('should store the target value if class matches', function(done) {
    var child = Model.extend('child');

    var testEvent = {
      target: {
        value: 'the value',
        className: 'child otherClass',
        dataset: {
          store: 'testField'
        }
      }
    };

    global.document.addEventListener = function(name, callback) {
      callback(testEvent);
    };

    var uut = new child();
    setTimeout(function() {
      uut.testField.should.be.equal('the value');
      done();
    }, 100);
  });

  it('should not store the target value if class not matches', function(done) {
    var child = Model.extend('child');

    var testEvent = {
      target: {
        value: 'the value',
        className: 'notChild otherClass',
        dataset: {
          store: 'testField'
        }
      }
    };

    global.document.addEventListener = function(name, callback) {
      callback(testEvent);
    };

    var uut = new child();
    setTimeout(function() {
      should.not.exist(uut.testField);
      done();
    }, 100);
  });

  it('should not store the target value if store is not present', function(done) {
    var child = Model.extend('child');

    var testEvent = {
      target: {
        value: 'the value',
        className: 'child otherClass',
        dataset: {
        }
      }
    };

    global.document.addEventListener = function(name, callback) {
      callback(testEvent);
    };

    var uut = new child();
    setTimeout(function() {
      should.not.exist(uut.testField);
      done();
    }, 100);
  });

  it('should make object observable', function(done) {
    global.Object.observe = function(obj, callback) {
      callback.should.be.a('function');
      //o.should.be.equal(uut);
      done();
    };

    var child = Model.extend('child');
    var uut = new child();
  });

  it('should make set DOM', function(done) {
    var DOM = {};

    global.document.querySelector = function(string) {
      string.should.be.equal('.child[data-view="testName"]');
      return DOM;
    };

    var changes = [
      {
        name: 'testName',
        object: {'testName': 'testValue'}
      }
    ];

    global.Object.observe = function(obj, callback) {
      callback(changes);
    };

    var child = Model.extend('child');
    var uut = new child();

    setTimeout(function() {
      DOM.textContent.should.be.equal('testValue');
      done();
    }, 100);
  });

});
