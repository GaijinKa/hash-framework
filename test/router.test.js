var chai = require('chai');
var should = chai.should();

var Router = require('../src/router');

describe('The hash router', function() {

  beforeEach(function(done) {
    global.window = {
      location: {}
    };
    done();
  });

  afterEach(function(done) {
    delete global.window;
    done();
  });

  it('should register onhashchange callback', function(done) {
    var uut = new Router();
    global.window.onhashchange.should.be.a('function');
    done();
  });

  it('should add a route', function(done) {
    var uut = new Router();

    var callback = function() {
      done();
    };

    uut.addRoute('test', callback);
    uut._routes.test.should.be.a('function');
    uut._routes.test();
  });

  it('should except if route name is not passed', function(done) {
    var uut = new Router();

    var callback = function() {
      console.log('This should not set');
    };

    var badFunction = function() {
      uut.addRoute(callback);
    };

    badFunction.should.throw(Error);
    done();

  });


  it('should except if callback is not passed', function(done) {
    var uut = new Router();

    var callback = function() {
      console.log('This should not set');
    };

    var badFunction = function() {
      uut.addRoute('test');
    };

    badFunction.should.throw(Error);
    done();

  });


  it('should call the callback when hash url changes', function(done) {
    var uut = new Router();

    var callback = function() {
      done();
    };

    uut.addRoute('test', callback);

    global.window.location.hash = '#test';
    global.window.onhashchange();

  });

  it('should pass url-encoded arguments', function(done) {
    var uut = new Router();

    var callback = function(args) {
      args.aVar.should.be.equal('aValue');
      done();
    };

    uut.addRoute('test', callback);

    global.window.location.hash = '#test?aVar=aValue';
    global.window.onhashchange();

  });

  it('should except if url is not defined', function(done) {
    var uut = new Router();

    global.window.location.hash = '#test';
    global.window.onhashchange.should.throw(Error, /Route not defined/);
    done();

  });

  it('should redirect to index if hash is void', function(done) {
    var uut = new Router();

    var callback = function(args) {
      done();
    };

    uut.addRoute('index', callback);

    global.window.location.hash = '';
    global.window.onhashchange();

  });

  it('should provide a static redirect method', function(done) {
    var uut = new Router();

    var callback = function() {
      done();
    };

    uut.addRoute('redirected', callback);
    Router.redirect('#redirected');
    global.window.onhashchange();

  });

  it('should redirect on index on load', function(done) {
    var uut = new Router();

    var callback = function() {
      done();
    };

    uut.addRoute('index', callback);
    global.window.onload();
    global.window.onhashchange();

  });

});
