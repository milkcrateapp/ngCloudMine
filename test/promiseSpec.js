describe('promise', function() {
  var wsStub = {
    search: function(){},
    set: function(){},
    login: function(){},
    logout: function(){}
  };

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
    var methodList = [
      'search', 'set', 'login', 'logout'
    ];

    methodList.forEach(
      function(method) {
        if (wsStub[method].restore) {
          wsStub[method].restore();
        }
      }
    );
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

  it('returns an angular promise when saving', function() {
    expect(cmWS.set).to.be.ok;

    sinon.stub(wsStub, 'set', function() {
      return {
        on: function() {
          return {
            on: function() {}
          };
        }
      };
    });

    expect(cmWS.set().then).to.be.ok;
  });

  it('returns an angular promise when logging out', function() {
    expect(cmWS.logout).to.be.ok;

    sinon.stub(wsStub, 'logout', function() {
      return {
        on: function() {
          return {
            on: function() {}
          };
        }
      };
    });

    expect(cmWS.logout().then).to.be.ok;
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
