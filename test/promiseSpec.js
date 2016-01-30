describe('promise', function() {

  var methodList = [
    'search', 'set', 'destroy', 'update', 'login', 'logout', 'run'
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

  it('returns and resolves angular promise when searching', function() {
    expect(cmWS.search).to.be.ok;
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

  it('returns and resolves promise when creating', function() {
    expect(cmWS.set).to.be.ok;
    sinon.stub(wsStub, 'set', setCloudmineSuccessResponse({data: 'data'}));

    var results = null;
    cmWS.set('id', {test: 'data'}, {options: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.set.callCount).to.equal(1);
    expect(wsStub.set.getCall(0).args[0]).to.equal('id');
    expect(wsStub.set.getCall(0).args[1]).to.deep.equal({test: 'data'});
    expect(wsStub.set.getCall(0).args[2]).to.deep.equal({options: '1'});

    expect(results.data).to.equal('data');
  });

  it('returns and resolves promise when deleting', function() {
    expect(cmWS.destroy).to.be.ok;

    sinon.stub(wsStub, 'destroy', setCloudmineSuccessResponse({data: 'data'}));

    var results = null;
    cmWS.destroy('id', {options: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.destroy.callCount).to.equal(1);
    expect(wsStub.destroy.getCall(0).args[0]).to.equal('id');
    expect(wsStub.destroy.getCall(0).args[1]).to.deep.equal({options: '1'});

    expect(results.data).to.equal('data');
  });

  it('returns and resolves promise when updating', function() {
    expect(cmWS.update).to.be.ok;

    sinon.stub(wsStub, 'update', setCloudmineSuccessResponse({data: 'data'}));

    var results = null;
    cmWS.update('id', {test: 'data'}, {options: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.update.callCount).to.equal(1);
    expect(wsStub.update.getCall(0).args[0]).to.equal('id');
    expect(wsStub.update.getCall(0).args[1]).to.deep.equal({test: 'data'});
    expect(wsStub.update.getCall(0).args[2]).to.deep.equal({options: '1'});

    expect(results.data).to.equal('data');
  });

  it('returns and resolves promise when logging out', function() {
    expect(cmWS.logout).to.be.ok;

    sinon.stub(wsStub, 'logout', setCloudmineSuccessResponse({data: 'data'}));

    var results = null;
    cmWS.logout().then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.logout.callCount).to.equal(1);

    expect(results.data).to.equal('data');
  });

  it('returns and resolves promise when logging in', function() {
    expect(cmWS.login).to.be.ok;

    sinon.stub(wsStub, 'login', setCloudmineSuccessResponse({data: 'data'}));

    var results = null;
    cmWS.login('user', 'password', {options: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.login.callCount).to.equal(1);
    expect(wsStub.login.getCall(0).args[0]).to.equal('user');
    expect(wsStub.login.getCall(0).args[1]).to.equal('password');
    expect(wsStub.login.getCall(0).args[2]).to.deep.equal({options: '1'});

    expect(results.data).to.equal('data');
  });

  it('returns an angular promise when running a snippet', function() {
    expect(cmWS.run).to.be.ok;

    sinon.stub(wsStub, 'run', setCloudmineResultResponse({data: 'data'}));

    var results = null;
    cmWS.run('script', {param: 'param'}, {options: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.run.callCount).to.equal(1);
    expect(wsStub.run.getCall(0).args[0]).to.equal('script');
    expect(wsStub.run.getCall(0).args[1]).to.deep.equal({param: 'param'});
    expect(wsStub.run.getCall(0).args[2]).to.deep.equal({options: '1'});

    expect(results.data).to.equal('data');
  });

});
