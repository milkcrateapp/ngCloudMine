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
    var deferred = $q.defer();

    window.ws[method].apply(window.ws, args)
    .on('success', function(data) {
      deferred.resolve(arrayify(data));
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
          if (page < 0 || page >= this.pages) {
            return $q.reject('Page doesn\'t exist');
          }

          var options = {
            applevel: true,
            limit: pageCount,
            skip: page * pageCount
          };

          return deferSuccessAndError('search', [query, options]);
        }
      };

      return this.getSearchCount(query, options)
      .then(function(count) {
        pager.count = count
        pager.pages = Math.ceil(count / pageCount);

        return pager;
      });
    }
  };
}]);
