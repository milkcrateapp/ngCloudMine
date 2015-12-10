angular.module('ngCloudMine', [])

.service('cmWS', ['$q', function($q) {
  function deferSuccessAndError(method, args) {
    var deferred = $q.defer();

    window.ws[method].apply(this, args)
    .on('success', function(data, cloudmineMeta) {
      data.cloudmineMeta = cloudmineMeta;
      deferred.resolve(data);
    }).on('error', function(error, cloudmineMeta) {
      error.cloudmineMeta = cloudmineMeta;
      deferred.reject(error);
    });

    return deferred.promise;
  };

  return {
    getSearchCount: function(query, options) {
      if (!options) {
        options = {};
      }

      options.limit = 0;
      options.count = true;

      return deferSuccessAndError('search', [query, options]).then(
        function (data) {
          return data.cloudmineMeta.count;
        }
      );
    },

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
    }
  };
}]);
