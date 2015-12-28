describe('distance', function() {
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

  describe('query', function() {

    it('requires query, options, and vars', function() {
      var errorResponse = null;

      expect(cmWS.getDistanceCount).to.be.ok;

      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 4}]));

      cmWS.getDistanceCount().catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing query');

      cmWS.getDistanceCount('query').catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing options');

      cmWS.getDistanceCount('query', {}).catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing distance');

      cmWS.getDistanceCount('query', {}, .1).catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing latitude');

      cmWS.getDistanceCount('query', {}, .1, 1.23).catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing longitude');

      cmWS.getDistanceCount('query', {}, .1, 1.23, 2.34).catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing distance variable in query');

      cmWS.getDistanceCount('[query, #{distance}mi]', {}, .1, 1.23, 2.34).catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing latitude variable in query');

      cmWS.getDistanceCount('[query, location near (#{lat})#{distance}mi]', {}, .1, 1.23, 2.34).catch(function(err) {
        errorResponse = err;
      });
      $rootScope.$apply();
      expect(errorResponse).to.equal('Missing longitude variable in query');

    });

    it('gets the count', function() {
      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 4}]));

      var results = null;
      cmWS.getDistanceCount('[query, location near (#{long}, #{lat}), #{distance}mi]', {applevel: true}, 0.1, 1.23, 4.56).then(function(data) {
        results = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(1);
      expect(wsStub.search.getCall(0).args[0]).to.equal('[query, location near (4.56, 1.23), 0.1mi]');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({
        applevel: true,
        limit: 0,
        count: true
      });
      expect(results).to.equal(4);
    });

  });

});
