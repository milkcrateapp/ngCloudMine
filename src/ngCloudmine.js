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
