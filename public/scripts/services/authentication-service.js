app.factory('Authentication', ['$resource', '$rootScope', '$http', '$localStorage', '$q',
  function($resource, $rootScope, $http, $localStorage, $q) {
    var token = $localStorage.token;
    if (token) {
      var userId = JSON.parse($localStorage.userId).id;
      $rootScope.isloggedin = true;
    }
    // var BASE_URL = 'https://developer-central.herokuapp.com';
    // var BASE_URL = 'http://localhost:8000/';
    var ApiRequest = {
      getUser: function() {
        if (token) {
          $http.get('user/me/' + userId).success(function(response) {
            // console.log('get user response', response);
            return response;
          }).error(function(error) {
            return error;
          });

        }
        return;
        // $scope.signedIn = true;
      },
      // signIn: function(user, success, error) {
      //   return $http.post(BASE_URL + 'signin', user);
      // },
      logOut: function(success) {
        // changeUser({});
        delete $localStorage.token;
        delete $localStorage.userId;
        success();
      },
      currentUser: function() {
        return getUserFromToken();
      }
        // updateUser: function(user, success, error) {
        // return $http.put(BASE_URL + 'user/' + user._id, user);
        // }
    };

    function getUserFromToken() {
      if (token) {
        $http.get('user/me/' + userId).success(function(response) {
          // console.log('get user response', response);
          return response;
        }).error(function(error) {
          return error;
        });

      }
    }

    function changeUser(user) {
      angular.extend(ApiRequest.currentUser, user);
    }

    // function tokenInterceptor(config){

    // }
    return ApiRequest;
  }
]);

// $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
//    return {
//        'request': function (config) {
//            config.headers = config.headers || {};
//            if ($localStorage.token) {
//                config.headers.Authorization = 'Bearer ' + $localStorage.token;
//            }
//            return config;
//        },
//        'responseError': function (response) {
//            if (response.status === 401 || response.status === 403) {
//                $location.path('/signin');
//            }
//            return $q.reject(response);
//        }
//    };
// }]);
