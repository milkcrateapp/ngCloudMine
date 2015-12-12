angular.module('ngCloudMine', [])

.service('cmWS', ['$q', function($q) {
  function arrayify(data) {
    var ary = [];

    for (var key in data) {
      var obj = data[key];

      ary.push(obj);
      ary[key] = obj;
    }

    return ary;
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

  return {
    search: function(query, options) {
      return deferSuccessAndError('search', [query, options]);
    },

    logout: function(email, password, options) {
      return deferSuccessAndError('logout', []);
    },

    set: function(id, object, options) {
      return deferSuccessAndError('set', [id, object, options]);
    },

    update: function(id, object, options) {
      return deferSuccessAndError('update', [id, object, options]);
    },

    login: function(email, password, options) {
      return deferSuccessAndError('login', [email, password, options]);
    },

    getSearchCount: function(query, options) {
      if (!options) {
        options = {};
      }

      options.applevel = true;
      options.limit = 0;
      options.count = true;

      return deferSuccessAndErrorWithHandlers('search', [query, options], function(data, meta, deferred) {
        deferred.resolve(meta.count);
      });
    },

    getPager: function(countPerPage, query, options, updater) {
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
        total: 0,
        countPerPage: countPerPage,
        totalPages: 0,
        page: 0,
        getPage: function(page) {
          var opts = angular.copy(options);
          this.page = page;

          if (page < 0 || page >= this.totalPages) {
            return $q.reject('Page doesn\'t exist');
          }

          opts.limit = countPerPage;
          opts.skip = page * countPerPage;

          return deferSuccessAndError('search', [query, opts]).then(updater);
        }
      };

      return this.getSearchCount(query, angular.copy(options))
      .then(function(total) {
        pager.total = total;
        pager.totalPages = Math.ceil(total / countPerPage);

        return pager;
      });
    }
  };
}]);
