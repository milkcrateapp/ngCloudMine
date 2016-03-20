describe('thrice', function() {

  var $rootScope = null;
  var cmWS = null;

  wsStub = {
    search: function() {}
  };

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
    if (wsStub.search.restore) {
      wsStub.search.restore();
    }
  });

  it('calls search thrice if it fails', function() {

    sinon.stub(wsStub, 'search', setCloudmineFailResponse({error: 'error'}));

    var error = null;
    cmWS.thrice('search', 'query', {option: '1'}).catch(function(err) {
      error = err;
    });
    $rootScope.$apply();

    expect(wsStub.search.callCount).to.equal(3);

    for (var callOn=0; callOn<3; callOn++) {
      var args = wsStub.search.getCall(callOn).args;
      expect(args[0]).to.equal('query');
      expect(args[1]).to.deep.equal({option: '1' });
    }

    expect(error).to.deep.equal({error: 'error'});

  });

  it('calls search thrice and finally succeeds', function() {

    sinon.stub(wsStub, 'search', setCloudmineResponses([
      {error: 'error1'},
      {error: 'error2'},
      {success: {data: 'success'}}
    ]));

    var results = null;
    cmWS.thrice('search', 'query', {option: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.search.callCount).to.equal(3);
    expect(results[0]).to.deep.equal('success');
    expect(results.data).to.deep.equal('success');

  });

});
