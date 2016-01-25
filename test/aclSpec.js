describe('acl', function() {

  var methodList = ['getACL', 'getACLs', 'updateACL'];
  var wsStub = {};

  methodList.forEach(function(method) {
    wsStub[method] = function() {};
  });

  var $rootScope = null;
  var cmWS = null;

  beforeEach(function() {
    module('ngCloudMine');
  });

  beforeEach(function() {
    inject(function($injector) {
      window.ws = wsStub;
      $rootScope = $injector.get('$rootScope');
      cmWS = $injector.get('cmWS');
    });
  });

  afterEach(function() {
    methodList.forEach(function(method) {
      if (wsStub[method].restore) {
        wsStub[method].restore();
      }
    });
  });

  it('get', function() {
    expect(cmWS.getACL).to.be.ok;

    sinon.stub(wsStub, 'getACL', emptyCloudmineSuccessResponse);

    expect(cmWS.getACL('id').then).to.be.ok;

    expect(wsStub.getACL.callCount).to.equal(1);
    expect(wsStub.getACL.getCall(0).args[0]).to.equal('id');
  });

  it('gets all', function() {
    expect(cmWS.getACLs).to.be.ok;

    sinon.stub(wsStub, 'getACLs', emptyCloudmineSuccessResponse);

    expect(cmWS.getACLs().then).to.be.ok;

    expect(wsStub.getACLs.callCount).to.equal(1);
  });

  it('creates', function() {
    expect(cmWS.updateACL).to.be.ok;

    sinon.stub(wsStub, 'updateACL', emptyCloudmineSuccessResponse);

    expect(cmWS.updateACL('ACL').then).to.be.ok;

    expect(wsStub.updateACL.callCount).to.equal(1);
    expect(wsStub.updateACL.getCall(0).args[0]).to.equal('ACL');
  });

});
