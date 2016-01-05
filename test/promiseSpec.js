describe('promise', function() {

  var methodList = [
    'search', 'set', 'update', 'login', 'logout'
  ];

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

  it('returns an angular promise when searching', function() {
    expect(cmWS.search).to.be.ok;

    sinon.stub(wsStub, 'search', emptyCloudmineSuccessResponse);

    expect(cmWS.search().then).to.be.ok;
  });

  it('resolves the promise on success', function() {
    sinon.stub(wsStub, 'search', setCloudmineSuccessResponse({data: 'data'}));

    var results = null;
    cmWS.search('query', {option: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.search.callCount).to.equal(1);
    expect(wsStub.search.getCall(0).args[0]).to.equal('query');
    expect(wsStub.search.getCall(0).args[1]).to.deep.equal({option: '1'});

    expect(results.data).to.equal('data');
  });

  it('returns an angular promise when saving', function() {
    expect(cmWS.set).to.be.ok;

    sinon.stub(wsStub, 'set', emptyCloudmineSuccessResponse);

    expect(cmWS.set().then).to.be.ok;
  });

  it('returns an angular promise when updating', function() {
    expect(cmWS.update).to.be.ok;

    sinon.stub(wsStub, 'update', emptyCloudmineSuccessResponse);

    expect(cmWS.update().then).to.be.ok;
  });

  it('returns an angular promise when logging out', function() {
    expect(cmWS.logout).to.be.ok;

    sinon.stub(wsStub, 'logout', emptyCloudmineSuccessResponse);

    expect(cmWS.logout().then).to.be.ok;
  });

  it('returns an angular promise when logging in', function() {
    expect(cmWS.login).to.be.ok;

    sinon.stub(wsStub, 'login', emptyCloudmineSuccessResponse);

    expect(cmWS.login().then).to.be.ok;
  });

});
