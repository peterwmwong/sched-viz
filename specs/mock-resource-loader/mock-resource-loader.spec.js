var __slice = Array.prototype.slice;

define(function() {
  return function(_arg) {
    var getRequire, loadModule, mockModules;
    mockModules = _arg.mockModules, loadModule = _arg.loadModule, getRequire = _arg.getRequire;
    describe('#getSync', function() {
      return describe('creates a sync function (to override Backbone.sync)', function() {
        var MockModel;
        MockModel = (function() {

          function MockModel(_arg2) {
            this.url = _arg2.url;
            this.toJSON = sinon.stub().returns({});
          }

          return MockModel;

        })();
        beforeEach(function() {
          var _this = this;
          return loadModule({
            'mock-resource-loader/mock-resources': {
              res1: {
                create: this.mock_res1_create = sinon.stub().returns(this.mock_res1_create_return = {
                  a: 5
                }),
                read: this.mock_res1_read = sinon.stub()
              },
              res2: {
                create: this.mock_res2_create = sinon.stub().throws("Blah"),
                update: this.mock_res2_update = sinon.stub()
              }
            }
          }, function(mock_data_loader) {
            _this.mock_data_loader = mock_data_loader;
            return _this.sync = _this.mock_data_loader.getSync();
          });
        });
        it('should be a function', function() {
          return expect(typeof this.sync).toBe('function');
        });
        it('should be cache the function', function() {
          return expect(this.sync).toBe(this.mock_data_loader.getSync());
        });
        it('when called, should choose the appropriate resource handler', function() {
          var _this = this;
          runs(function() {
            return _this.sync('create', new MockModel({
              url: '/res1'
            }), {
              success: (function() {}),
              error: (function() {})
            });
          });
          waitsFor(function() {
            return _this.mock_res1_create.callCount === 1;
          });
          runs(function() {
            expect(_this.mock_res1_create.callCount).toBe(1);
            expect(_this.mock_res1_read.callCount).toBe(0);
            expect(_this.mock_res2_create.callCount).toBe(0);
            return expect(_this.mock_res2_update.callCount).toBe(0);
          });
          runs(function() {
            return _this.sync('update', new MockModel({
              url: '/res2'
            }), {
              success: (function() {}),
              error: (function() {})
            });
          });
          waitsFor(function() {
            return _this.mock_res2_update.callCount;
          });
          return runs(function() {
            expect(_this.mock_res1_create.callCount).toBe(1);
            expect(_this.mock_res1_read.callCount).toBe(0);
            expect(_this.mock_res2_create.callCount).toBe(0);
            return expect(_this.mock_res2_update.callCount).toBe(1);
          });
        });
        it('when called, should pass the id, model.toJSON() and options', function() {
          var _this = this;
          runs(function() {
            return _this.sync('read', (_this.mockModel = new MockModel({
              url: '/res1/mock_id'
            })), (_this.mock_opts = {
              success: (function() {}),
              error: (function() {})
            }));
          });
          waitsFor(function() {
            return _this.mock_res1_read.callCount;
          });
          return runs(function() {
            expect(_this.mockModel.toJSON.callCount).toBe(1);
            expect(_this.mock_res1_read.callCount).toBe(1);
            return expect(_this.mock_res1_read.calledWith('mock_id', _this.mockModel.toJSON.getCall(0).returnValue, _this.mock_opts)).toBe(true);
          });
        });
        it('when called, should pass the undefined (id not specified), model.toJSON() and options ', function() {
          var _this = this;
          runs(function() {
            return _this.sync('read', (_this.mockModel = new MockModel({
              url: '/res1'
            })), (_this.mock_opts = {
              success: (function() {}),
              error: (function() {})
            }));
          });
          waitsFor(function() {
            return _this.mock_res1_read.callCount;
          });
          return runs(function() {
            expect(_this.mockModel.toJSON.callCount).toBe(1);
            expect(_this.mock_res1_read.callCount).toBe(1);
            return expect(_this.mock_res1_read.calledWith(void 0, _this.mockModel.toJSON.getCall(0).returnValue, _this.mock_opts)).toBe(true);
          });
        });
        it('when called, should call opts.success with resource handler result', function() {
          var _this = this;
          runs(function() {
            return _this.sync('create', (_this.mock_model = new MockModel({
              url: '/res1'
            })), {
              success: _this.mock_success = sinon.stub(),
              error: _this.mock_error = sinon.stub()
            });
          });
          waitsFor(function() {
            return _this.mock_success.calledOnce;
          });
          return runs(function() {
            expect(_this.mock_error.called).toBe(false);
            expect(_this.mock_success.calledOnce).toBe(true);
            return expect(_this.mock_success.getCall(0).args[0]).toEqual(_this.mock_res1_create_return);
          });
        });
        it("when called with a url that doesn't map to a resource handler, calls opts.error", function() {
          var _this = this;
          runs(function() {
            return _this.sync('create', (_this.mock_model = new MockModel({
              url: '/bogus_url'
            })), {
              success: _this.mock_success = sinon.stub(),
              error: _this.mock_error = sinon.stub()
            });
          });
          waitsFor(function() {
            return _this.mock_error.calledOnce;
          });
          return runs(function() {
            expect(_this.mock_success.called).toBe(false);
            expect(_this.mock_error.calledOnce).toBe(true);
            return expect(_this.mock_error.getCall(0).args[0]).toBe("Couldn't find mock resource handler");
          });
        });
        it("when called with a url maps to a resource handler, BUT handler can't handle method, calls opts.error", function() {
          var _this = this;
          runs(function() {
            var mock_model;
            return _this.sync('update', (mock_model = new MockModel({
              url: '/res1'
            })), {
              success: _this.mock_success = sinon.stub(),
              error: _this.mock_error = sinon.stub()
            });
          });
          waitsFor(function() {
            return _this.mock_error.calledOnce;
          });
          return runs(function() {
            expect(_this.mock_success.called).toBe(false);
            expect(_this.mock_error.calledOnce).toBe(true);
            return expect(_this.mock_error.getCall(0).args[0]).toBe("Couldn't find mock resource handler");
          });
        });
        return it("when called and resource handler throws error, calls opts.error", function() {
          var _this = this;
          runs(function() {
            var mock_model;
            return _this.sync('create', (mock_model = new MockModel({
              url: '/res2'
            })), {
              success: _this.mock_success = sinon.stub(),
              error: _this.mock_error = sinon.stub()
            });
          });
          waitsFor(function() {
            return _this.mock_error.calledOnce;
          });
          return runs(function() {
            expect(_this.mock_success.called).toBe(false);
            return expect(_this.mock_error.calledOnce).toBe(true);
          });
        });
      });
    });
    describe('#_getResourceRoutes', function() {
      beforeEach(function() {
        var _this = this;
        return loadModule({
          'mock-resource-loader/mock-resources': {
            res1: this.mock_res1 = {
              method1: function() {},
              method2: function() {}
            },
            res2: this.mock_res2 = {
              method3: function() {},
              method4: function() {}
            }
          }
        }, function(mock_data_loader) {
          _this.mock_data_loader = mock_data_loader;
          _this.spy_getResourceRouteParser = sinon.spy(_this.mock_data_loader, '_getResourceRouteParser');
          return _this.routes = _this.mock_data_loader._getResourceRoutes();
        });
      });
      it('generates correct url specs for resources from "mock-resource-loader/mock-resources"', function() {
        expect(this.spy_getResourceRouteParser.callCount).toEqual(2);
        expect(this.spy_getResourceRouteParser.getCall(0).calledWith('res1')).toBe(true);
        return expect(this.spy_getResourceRouteParser.getCall(1).calledWith('res2')).toBe(true);
      });
      it('returns array of [route method, resource handlers from "mock-resource-loader/mock-resources"]', function() {
        return expect(this.routes).toEqual([[this.spy_getResourceRouteParser.returnValues[0], this.mock_res1], [this.spy_getResourceRouteParser.returnValues[1], this.mock_res2]]);
      });
      return it('caches parsed routes', function() {
        expect(this.mock_data_loader._getResourceRoutes()).toBe(this.mock_data_loader._getResourceRoutes());
        return expect(this.spy_getResourceRouteParser.callCount).toEqual(2);
      });
    });
    return describe('#_getResourceRouteParser', function() {
      var validate, _getResourceRouteParser;
      _getResourceRouteParser = void 0;
      validate = function() {
        var exp, input, inputExpects, res, _i, _len, _ref, _results;
        res = arguments[0], inputExpects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        _results = [];
        for (_i = 0, _len = inputExpects.length; _i < _len; _i++) {
          _ref = inputExpects[_i], input = _ref[0], exp = _ref[1];
          _results.push((function(input, exp) {
            return it("Given '" + res + "', '" + input + "' -> " + (JSON.stringify(exp)), function() {
              var f;
              f = _getResourceRouteParser(res);
              return expect(f(input))[exp === void 0 && 'toBe' || 'toEqual'](exp);
            });
          })(input, exp));
        }
        return _results;
      };
      beforeEach(function() {
        return loadModule({
          'mock-resource-loader/mock-resources': {}
        }, function(mock_data_loader) {
          return _getResourceRouteParser = mock_data_loader._getResourceRouteParser;
        });
      });
      return validate('abc', ['/abc', {}], ['/abc/', {}], [
        '/abc/myid', {
          id: 'myid'
        }
      ]);
    });
  };
});
