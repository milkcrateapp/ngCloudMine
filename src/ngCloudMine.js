angular.module('ngCloudMine', [])

.service('cmWS', ['$q', function($q) {
  function deferSuccessAndError(method, args) {
    var deferred = $q.defer();

    window.ws[method].apply(this, args)
    .on('success', function(data) {
      deferred.resolve(data);
    }).on('error', function(error) {
      deferred.reject(error);
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
      var deferred = $q.defer();
      if (!options) {
        options = {};
      }

      options.applevel = true;
      options.limit = 0;
      options.count = true;

      window.ws.search(query, options).on('success', function(data, meta) {
        deferred.resolve(meta.count);
      });

      return deferred.promise;
    },

    getPager: function(pageCount, query, options) {
      var pager = {
        query: query,
        count: null,
        pageCount: null,
        pages: null,
        getPage: function(page) {
          if (page < 1 || page > this.pages) {
            return $q.reject('Page doesn\'t exist');
          }

          var options = {
            applevel: true,
            limit: pageCount,
            skip: (page - 1) * pageCount
          };

          return deferSuccessAndError('search', [query, options]);
        }
      };

      return this.getSearchCount(query, options)
      .then(function(count) {
        pager.pages = Math.ceil(count / pageCount);

        return pager;
      });
    }
  };
}]);
