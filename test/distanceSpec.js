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
    wsStub.search = function() {};
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

    it('does the query', function() {
      expect(cmWS.getWithDistance).to.be.ok;

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
      cmWS.getWithDistance(
        '[query, location near (#{long}, #{lat}), #{distance}mi]',
        {applevel: true}, 0.1, 1.23, 4.56
      ).then(function(data) {
        results = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(1);
      expect(wsStub.search.getCall(0).args[0]).to.equal('[query, location near (4.56, 1.23), 0.1mi]');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({applevel: true, distance: true});
      expect(results[0]).to.deep.equal({name: 'biz1', id: 'biz1', distance: 0.1});
      expect(results.biz1).to.deep.equal({name: 'biz1', id: 'biz1', distance: 0.1});
      expect(results[1]).to.deep.equal({name: 'biz2', id: 'biz2', distance: 0.2});
      expect(results.biz2).to.deep.equal({name: 'biz2', id: 'biz2', distance: 0.2});
      expect(results[2]).to.deep.equal({name: 'biz3', id: 'biz3', distance: 0.3});
      expect(results.biz3).to.deep.equal({name: 'biz3', id: 'biz3', distance: 0.3});
      expect(results[3]).to.deep.equal({name: 'biz4', id: 'biz4', distance: 0.4});
      expect(results.biz4).to.deep.equal({name: 'biz4', id: 'biz4', distance: 0.4});
    });

  });

  describe('count', function() {

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

    it('checks threshold when fails', function() {
      wsStub.search = sinon.stub();

      wsStub.search.onCall(0).returns(
        setCloudmineSuccessResponse([{}, {count: 1}])()
      );
      wsStub.search.onCall(1).returns(
        setCloudmineSuccessResponse([{}, {count: 2}])()
      );
      wsStub.search.onCall(2).returns(
        setCloudmineSuccessResponse([{}, {count: 3}])()
      );
      wsStub.search.onCall(3).returns(
        setCloudmineSuccessResponse([{}, {count: 4}])()
      );
      wsStub.search.onCall(4).returns(
        setCloudmineSuccessResponse([{}, {count: 4}])()
      );
      wsStub.search.onCall(5).returns(
        setCloudmineSuccessResponse([{}, {count: 4}])()
      );
      wsStub.search.onCall(6).returns(
        setCloudmineSuccessResponse([{}, {count: 4}])()
      );

      var results = null;
      cmWS.getDistanceCountWithThreshold('[query, location near (#{long}, #{lat}), #{distance}mi]', {}, 5, 20, 1.23, 4.56).then(function(data) {
        results = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(6);

      expect(wsStub.search.getCall(0).args[0]).to.equal('[query, location near (4.56, 1.23), 0.1mi]');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({
        limit: 0,
        count: true
      });

      expect(wsStub.search.getCall(1).args[0]).to.equal('[query, location near (4.56, 1.23), 0.3mi]');
      expect(wsStub.search.getCall(1).args[1]).to.deep.equal({
        limit: 0,
        count: true
      });

      expect(wsStub.search.getCall(2).args[0]).to.equal('[query, location near (4.56, 1.23), 0.9mi]');
      expect(wsStub.search.getCall(2).args[1]).to.deep.equal({
        limit: 0,
        count: true
      });

      expect(wsStub.search.getCall(3).args[0]).to.equal('[query, location near (4.56, 1.23), 2.7mi]');
      expect(wsStub.search.getCall(3).args[1]).to.deep.equal({
        limit: 0,
        count: true
      });

      expect(wsStub.search.getCall(4).args[0]).to.equal('[query, location near (4.56, 1.23), 8.1mi]');
      expect(wsStub.search.getCall(4).args[1]).to.deep.equal({
        limit: 0,
        count: true
      });

      expect(wsStub.search.getCall(5).args[0]).to.equal('[query, location near (4.56, 1.23), 24.3mi]');
      expect(wsStub.search.getCall(5).args[1]).to.deep.equal({
        limit: 0,
        count: true
      });

      expect(results).to.deep.equal({distance: 24.3, count: 4});
    });

    it('checks threshold when succeeds', function() {
      wsStub.search = sinon.stub();

      wsStub.search.onCall(0).returns(
        setCloudmineSuccessResponse([{}, {count: 1}])()
      );
      wsStub.search.onCall(1).returns(
        setCloudmineSuccessResponse([{}, {count: 2}])()
      );
      wsStub.search.onCall(2).returns(
        setCloudmineSuccessResponse([{}, {count: 3}])()
      );
      wsStub.search.onCall(3).returns(
        setCloudmineSuccessResponse([{}, {count: 8}])()
      );

      var results = null;
      cmWS.getDistanceCountWithThreshold('[query, location near (#{long}, #{lat}), #{distance}mi]', {}, 5, 20, 1.23, 4.56).then(function(data) {
        results = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(4);

      expect(results).to.deep.equal({distance: 2.7, count: 8});
    });

  });

  describe('object', function() {

    it('creates', function() {
      expect(cmWS.getDistancePager).to.be.ok;

      wsStub.search = sinon.stub();

      wsStub.search.onCall(0).returns(
        setCloudmineSuccessResponse([{}, {count: 4}])()
      );
      wsStub.search.onCall(1).returns(
        setCloudmineSuccessResponse([{}, {count: 8}])()
      );
      wsStub.search.onCall(2).returns(
        setCloudmineSuccessResponse([{}, {count: 52}])()
      );

      var pager = null;
      cmWS.getDistancePager(5, '[query, location near (#{long}, #{lat}), #{distance}mi]', 25, 2.34, 5.67, {applevel: true}).then(function(data) {
        pager = data;
      });
      $rootScope.$apply();

      expect(wsStub.search.callCount).to.equal(3);

      expect(wsStub.search.getCall(0).args[0]).to.equal('[query, location near (5.67, 2.34), 0.1mi]');
      expect(wsStub.search.getCall(0).args[1]).to.deep.equal({
        applevel: true,
        limit: 0,
        count: true
      });

      expect(wsStub.search.getCall(1).args[0]).to.equal('[query, location near (5.67, 2.34), 0.3mi]');
      expect(wsStub.search.getCall(1).args[1]).to.deep.equal({
        applevel: true,
        limit: 0,
        count: true
      });

      expect(pager.query).to.equal('[query, location near (5.67, 2.34), 25mi]');
      expect(pager.countPerPage).to.equal(5);
      expect(pager.page).to.equal(0);
      expect(pager.total).to.equal(52);
      expect(pager.totalPages).to.equal(11);
    });

    it('changes distance and query', function() {
      sinon.stub(wsStub, 'search', setCloudmineSuccessResponse([{}, {count: 7}]));

      var pager = null;
      cmWS.getDistancePager(2, '[query, location near (#{long}, #{lat}), #{distance}mi]', .1, 1.23, 4.56)
      .then(function(data) {
        pager = data;
      });
      $rootScope.$apply();

      pager.setDistanceLatAndLong(.2, 2.46, 10.12);
      expect(wsStub.search.callCount).to.equal(3);
      expect(pager.query).to.equal('[query, location near (10.12, 2.46), 0.2mi]');
    });

  });

});
