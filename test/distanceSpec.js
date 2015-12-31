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

    it('does the query', function() {
      expect(cmWS.getDistance).to.be.ok;

      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([
        {
          biz1: {name: 'biz1'},
          biz2: {name: 'biz2'},
          biz3: {name: 'biz3'},
          biz4: {name: 'biz4'}
        },
        {
          biz1: {geo: {distance: 0.1}},
          biz2: {geo: {distance: 0.2}},
          biz3: {geo: {distance: 0.3}},
          biz4: {geo: {distance: 0.4}}
        }
      ]));

      var results = null;
      cmWS.getDistance(
        '[query, location near (#{long}, #{lat}), #{distance}mi]',
        {applevel: true}, 0.1, 1.23, 4.56
      ).then(function(data) {
        results = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(1);
      expect(wsStub.search.getCall(0).args[0]).to.equal('[query, location near (4.56, 1.23), 0.1mi]');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({applevel: true, distance: true});
      expect(results[0]).to.deep.equal({name: 'biz1', distance: 0.1});
      expect(results.biz1).to.deep.equal({name: 'biz1', distance: 0.1});
      expect(results[1]).to.deep.equal({name: 'biz2', distance: 0.2});
      expect(results.biz2).to.deep.equal({name: 'biz2', distance: 0.2});
      expect(results[2]).to.deep.equal({name: 'biz3', distance: 0.3});
      expect(results.biz3).to.deep.equal({name: 'biz3', distance: 0.3});
      expect(results[3]).to.deep.equal({name: 'biz4', distance: 0.4});
      expect(results.biz4).to.deep.equal({name: 'biz4', distance: 0.4});
    });

  });

  describe('object', function() {

    it('creates', function() {
      expect(cmWS.getDistancePager).to.be.ok;

      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 6}]));

      var pager = null;
      cmWS.getDistancePager(2, '[query, location near (#{long}, #{lat}), #{distance}mi]', .2, 2.34, 5.67, {applevel: true}).then(function(data) {
        pager = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(1);
      expect(wsStub.search.getCall(0).args[0]).to.equal('[query, location near (5.67, 2.34), 0.2mi]');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({
        applevel: true,
        limit: 0,
        count: true
      });

      expect(pager.query).to.equal('[query, location near (5.67, 2.34), 0.2mi]');
      expect(pager.countPerPage).to.equal(2);
      expect(pager.page).to.equal(0);
      expect(pager.total).to.equal(6);
      expect(pager.totalPages).to.equal(3);
    });

  });

});
