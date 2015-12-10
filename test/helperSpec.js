describe('helpers', function() {
  var $rootScope = null,
      wsStub = {
        search: function(){}
      };

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
    if (wsStub.search.restore) {
      wsStub.search.restore();
    }
  });

  it('arrayifies the data', function() {
    expect(cmWS.getSearchCount).to.be.ok;
    var data = {
      data1: 'data1',
      data2: 'data2'
    };

    sinon.stub(wsStub, 'search', setCloudmineSuccessResponse(data));

    var results = null;
    cmWS.search('query', {applevel: true}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(results.length).to.equal(2);
    expect(results[0]).to.deep.equal('data1');
    expect(results['data1']).to.deep.equal('data1');
    expect(results[1]).to.deep.equal('data2');
    expect(results['data2']).to.deep.equal('data2');
  });

});
