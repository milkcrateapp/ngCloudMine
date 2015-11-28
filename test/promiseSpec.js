describe('promise', function() {
  var wsStub = {
    search: function(){},
    login: function(){}
  };
  var cloudmine = {
    WebServices: function() {
      return wsStub;
    }
  };

  var $rootScope = null;
  var cmWS = null;

  beforeEach(function() {
    window.cloudmine = cloudmine;
    module('ngCloudMine');
  });

  beforeEach(function() {
    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      cmWS = $injector.get('cmWS');
    });
  });

  afterEach(function() {
    if (wsStub.search.restore) {
      wsStub.search.restore();
    }
    if (wsStub.login.restore) {
      wsStub.login.restore();
    }
  });

  it('returns an angular promise when searching', function() {
    expect(cmWS.search).to.be.ok;

    sinon.stub(wsStub, 'search', function() {
      return {
        on: function() {
          return {
            on: function() {}
          };
        }
      };
    });

    expect(cmWS.search().then).to.be.ok;
  });

  it('resolves the promise on success', function() {
    sinon.stub(wsStub, 'search', function() {
      return {
        on: function(status, searchSuccess) {
          searchSuccess('data');

          return {
            on: function() {}
          };
        }
      };
    });

    var results = null;
    cmWS.search('query', {option: '1'}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.search.callCount).to.equal(1);
    expect(wsStub.search.getCall(0).args[0]).to.equal('query');
    expect(wsStub.search.getCall(0).args[1]).to.deep.equal({option: '1'});

    expect(results).to.equal('data');
  });

  it('returns an angular promise when logging in', function() {
    expect(cmWS.login).to.be.ok;

    sinon.stub(wsStub, 'login', function() {
      return {
        on: function() {
          return {
            on: function() {}
          };
        }
      };
    });

    expect(cmWS.login().then).to.be.ok;
  });
});
