angular.module('ngCloudMine', [])

.service('cmWS', ['$q', function($q) {
  var service = {};

  var distanceRE = /#{distance}/,
      latRE = /#{lat}/,
      longRE = /#{long}/;

  function arrayify(data) {
    var ary = [];

    for (var key in data) {
      var obj = data[key];
      obj.id = key;

      ary.push(obj);
      ary[key] = obj;
    }

    return ary;
  };

  function checkDistanceParams(query, options, distance, lat, long) {
    var errorString = null;

    if (!query) {
      errorString = 'Missing query';
    } else if (!options) {
      errorString = 'Missing options';
    } else if (!distance) {
      errorString = 'Missing distance';
    } else if (!lat) {
      errorString = 'Missing latitude';
    } else if (!long) {
      errorString = 'Missing longitude';
    } else if (!query.match(distanceRE)) {
      errorString = 'Missing distance variable in query';
    } else if (!query.match(latRE)) {
      errorString = 'Missing latitude variable in query';
    } else if (!query.match(longRE)) {
      errorString = 'Missing longitude variable in query';
    }

    return errorString;
  }

  function distanceQuery(query, distance, lat, long) {
    query = query.replace(distanceRE, distance);
    query = query.replace(latRE, lat);
    query = query.replace(longRE, long);

    return query;
  };

  function calculateCount(pager) {
    return service.getSearchCount(pager.query, angular.copy(pager.options))
    .then(function(total) {
      pager.total = total;
      calcTotalPages(pager);

      return pager;
    });
  };

  function calcTotalPages(pager) {
    pager.totalPages = Math.ceil(pager.total / pager.countPerPage);
  };

  function deferSuccessAndError(method, args) {
    return deferSuccessAndErrorWithHandlers(method, args);
  };

  function deferSuccessAndErrorWithHandlers(method, args, successHandler, errorHandler) {
    var deferred = $q.defer();

    if (!successHandler) successHandler = function(data, meta, deferred) {
      deferred.resolve(data);
    };

    if (!errorHandler) errorHandler = function(err, deferred) {
      deferred.reject(err);
    };

    window.ws[method].apply(window.ws, args)
    .on('success', function(data, meta) {
      successHandler(arrayify(data), meta, deferred);
    }).on('error', function(err) {
      errorHandler(err, deferred);
    });

    return deferred.promise;
  };

  function deferResult(method, args) {
    var deferred = $q.defer();

    window.ws[method].apply(window.ws, args)
    .on('result', function(data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  };

  service.search = function(query, options) {
    return deferSuccessAndError('search', [query, options]);
  };

  service.logout = function(email, password, options) {
    return deferSuccessAndError('logout', []);
  };

  service.set = function(id, object, options) {
    return deferSuccessAndError('set', [id, object, options]);
  };

  service.destroy = function(id, options) {
    return deferSuccessAndError('destroy', [id, options]);
  };

  service.update = function(id, object, options) {
    return deferSuccessAndError('update', [id, object, options]);
  };

  service.login = function(email, password, options) {
    return deferSuccessAndError('login', [email, password, options]);
  };

  service.run = function(snippet, params, options) {
    return deferResult('run', [snippet, params, options]);
  };

  service.getACL = function(acl_id, options) {
    return deferSuccessAndError('getACL', [acl_id, options]);
  };

  service.getACLs = function(options) {
    return deferSuccessAndError('getACLs', [options]);
  };

  service.updateACL = function(acl, options) {
    return deferSuccessAndError('updateACL', [acl, options]);
  };

  service.getSearchCount = function(query, options) {
    if (!options) {
      options = {applevel: true};
    }

    options.limit = 0;
    options.count = true;

    return deferSuccessAndErrorWithHandlers('search', [query, options], function(data, meta, deferred) {
      deferred.resolve(meta.count);
    });
  };

  service.getDistanceCount = function(query, options, distance, lat, long) {
    var errorMessage = checkDistanceParams(query, options, distance, lat, long);
    if (errorMessage) {
      return $q.reject(errorMessage);
    }

    return service.getSearchCount(
      distanceQuery(query, distance, lat, long), options
    );
  };

  service.getDistanceCountWithThreshold =
  function(query, options, minCount, maxDistance, lat, long, currentDistance) {
    if (!currentDistance) {
      currentDistance = 0.1;
    }

    return service.getSearchCount(
      distanceQuery(query, currentDistance, lat, long), options
    ).then(function(count) {
      if (count >= minCount || currentDistance >= maxDistance) {
        return {distance: currentDistance, count: count};
      }

      return service.getDistanceCountWithThreshold(
        query, options, minCount, maxDistance, lat, long, 5 * currentDistance
      );
    });
  };

  service.getWithDistance = function(query, options, distance, lat, long) {
    var errorMessage = checkDistanceParams(query, options, distance, lat, long);
    if (errorMessage) {
      return $q.reject(errorMessage);
    }

    options.distance = true;
    query = distanceQuery(query, distance, lat, long);

    return deferSuccessAndErrorWithHandlers('search', [query, options], function(data, meta, deferred) {
      for (metaKey in meta) {
        var metaData = meta[metaKey];

        if (data[metaKey] && meta[metaKey].geo && meta[metaKey].geo.distance) {
          data[metaKey].distance = meta[metaKey].geo.distance;
        }
      }

      deferred.resolve(data);
    });
  };

  service.getPager = function(countPerPage, query, options, updater) {
    if (!options) {
      options = {applevel: true};
    }

    if (!updater) {
      updater = function(data) {
        return data;
      };
    }

    var pager = {
      query: query,
      options: options,
      total: 0,
      countPerPage: countPerPage,
      totalPages: 0,
      page: 0,

      setPerPage: function(perPage) {
        pager.countPerPage = perPage;
        calcTotalPages(pager);

        //TODO: Calculate new page to keep first item on page
        this.page = 0;

        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      },

      setQuery: function(query) {
        pager.query = query;
        return calculateCount(pager);
      },

      getPage: function(page) {
        var opts = angular.copy(options);
        this.page = page;

        if (page < 0 || page >= this.totalPages) {
          return $q.reject('Page doesn\'t exist');
        }

        opts.limit = this.countPerPage;
        opts.skip = page * this.countPerPage;

        return deferSuccessAndError('search', [this.query, opts]).then(updater);
      }
    };

    return calculateCount(pager);
  };

  service.getDistancePager = function(countPerPage, query, distance, lat, long, options, updater) {
    if (!options) {
      options = {};
    }

    var errorMessage = checkDistanceParams(query, options, distance, lat, long);
    if (errorMessage) {
      return $q.reject(errorMessage);
    }

    return this.getPager(
      countPerPage,
      distanceQuery(query, distance, lat, long),
      options, updater
    ).then(function(pager) {
      pager.originalQuery = query;
      pager.setDistanceLatAndLong = function(distance, lat, long) {
        var newDistanceQuery = distanceQuery(
          angular.copy(pager.originalQuery),
          distance, lat, long
        );

        pager.query = newDistanceQuery;

        return calculateCount(pager);
      };

      return pager;
    });
  };

  return service;
}]);
