angular.module('ngCloudMine', [])

.service('cmWS', ['$q', function($q) {
  function deferSuccessAndError(method, args) {
    var deferred = $q.defer();

    window.ws[method].apply(this, args)
    .on('success', function(data, response) {
      deferred.resolve(data, response);
    }).on('error', function(error) {
      deferred.reject(error);
    });

    return deferred.promise;
  };

  return {
    search: function(query, options) {
      return deferSuccessAndError('search', [query, options]);
    },

    getSearchCount: function() {
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
