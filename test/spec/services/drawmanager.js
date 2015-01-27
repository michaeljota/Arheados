'use strict';

describe('Service: drawManager', function () {

  // load the service's module
  beforeEach(module('arheadosApp'));

  // instantiate service
  var drawManager;
  beforeEach(inject(function (_drawManager_) {
    drawManager = _drawManager_;
  }));

  it('should do something', function () {
    expect(!!drawManager).toBe(true);
  });

});
