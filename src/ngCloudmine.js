angular.module('ngCloudMine', [])

.service('cmWS', ['$q', function($q) {

  return {
    search: function(query, options) {
      deferred = $q.defer();

      window.ws.search(query, options).on('success', function(data, response) {
        deferred.resolve(data, response);
      }).on('error', function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    },

    logout: function(email, password, options) {
      deferred = $q.defer();

      window.ws.logout().on('success', function(data, response) {
        deferred.resolve(data, response);
      }).on('error', function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    },

    set: function(id, object, options) {
      deferred = $q.defer();

      window.ws.set(id, object, options)
      .on('success', function(data, response) {
        deferred.resolve(data, response);
      })
      .on('error', function(err, response) {
        deferred.reject(err, response);
      });

      return deferred.promise;
    },

    update: function(id, object, options) {
      deferred = $q.defer();

      window.ws.update(id, object, options)
      .on('success', function(data, response) {
        deferred.resolve(data, response);
      })
      .on('error', function(err, response) {
        deferred.reject(err, response);
      });

      return deferred.promise;
    },

    login: function(email, password, options) {
      deferred = $q.defer();

      window.ws.login(email, password, options).on('success', function(data, response) {
        deferred.resolve(data, response);
      }).on('error', function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }
  };
}]);
