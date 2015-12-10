describe('paginate', function() {
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

  it('gets the count', function() {
    expect(cmWS.getSearchCount).to.be.ok;

    sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 4}]));

    var results = null;
    cmWS.getSearchCount('query', {applevel: true}).then(function(data) {
      results = data;
    });
    $rootScope.$apply();

    expect(wsStub.search.callCount).to.equal(1);
    expect(wsStub.search.getCall(0).args[0]).to.equal('query');
    expect(wsStub.search.getCall(0).args[1]).to.deep.equal({
      applevel: true,
      limit: 0,
      count: true
    });

    expect(results).to.equal(4);
  });

  describe('object', function() {

    it('knows the pages count', function() {
      expect(cmWS.getPager).to.be.ok;

      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 6}]));

      var pager = null;
      cmWS.getPager(2, 'query').then(function(data) {
        pager = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(1);
      expect(wsStub.search.getCall(0).args[0]).to.equal('query');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({
        applevel: true,
        limit: 0,
        count: true
      });

      expect(pager.pages).to.equal(3);
      expect(pager.query).to.equal('query');
    });

    it('knows the pages count with remainder', function() {
      expect(cmWS.getPager).to.be.ok;

      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 7}]));

      var pager = null;
      cmWS.getPager(2, 'query').then(function(data) {
        pager = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(1);
      expect(wsStub.search.getCall(0).args[0]).to.equal('query');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({
        applevel: true,
        limit: 0,
        count: true
      });

      expect(pager.pages).to.equal(4);
      expect(pager.query).to.equal('query');
    });

    it('can get pages', function() {
      expect(cmWS.getPager).to.be.ok;

      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 7}]));

      var pager = null;
      cmWS.getPager(2, 'query').then(function(data) {
        pager = data;
      });
      $rootScope.$apply();

      pager.getPage(0);
      pager.getPage(1);
      pager.getPage(2);
      pager.getPage(3);
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(5);
      expect(wsStub.search.getCall(1).args[1]).to.deep.equal({
        limit: 2,
        skip: 0,
        applevel: true
      });
      expect(wsStub.search.getCall(2).args[1]).to.deep.equal({
        limit: 2,
        skip: 2,
        applevel: true
      });
      expect(wsStub.search.getCall(3).args[1]).to.deep.equal({
        limit: 2,
        skip: 4,
        applevel: true
      });
      expect(wsStub.search.getCall(4).args[1]).to.deep.equal({
        limit: 2,
        skip: 6,
        applevel: true
      });

    });

  });
});
