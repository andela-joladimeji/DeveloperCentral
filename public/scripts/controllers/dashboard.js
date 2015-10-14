app.controller('DashboardCtrl', function($scope, $stateParams, $http, $localStorage, $modal, Authentication) {
  // console.log('ueser', Authentication.getUser());
  // 
  $scope.newAppForm = false;
  var userId;
  var token = $localStorage.token;
  if (token) {
    userId = JSON.parse($localStorage.userId).id;
  } else {
    userId = $stateParams.id;
  }

  $scope.getUser = function() {

    $scope.signedIn = true;

    $http.get('user/me/' + userId).success(function(response) {
      $scope.user = response;
    }).error(function(error) {
      $scope.error = error;
    });
  };

  $scope.selectedIndex = 0;
  $scope.selectedTabForApp = 0;

  $scope.tabViews = ['MY APPS', 'MY KEYS'];
  $scope.switchTab = function(index) {
    $scope.selectedIndex = index;
  };

  // $scope.tabForAppViews = ['ADD APP', 'SAMPLE APP'];
  $scope.switchTabForApp = function(index) {
    $scope.selectedTabForApp = index;
  };

  $scope.newApp = function(app) {
    $scope.emptyDataMessage = "";
    console.log('app', app, $scope.app);
    if (!$scope.checkData(app)) {
      return;
    } else {


      var postData = {
        name: app.name,
        description: app.description,
        key: app.selectedkey
      };
      $http.post('/user/' + userId + '/app/create', postData).success(function(response) {
        $scope.newAppForm = false;

        $scope.newApp = response.data;

        //delete key so it does not display in select box for 
        // $http.delete('/user/' + userId + '/app/' + app._id + '/delete').success(function(response) {
        //   $scope.newKey = response.data;
        // }).error(function(error) {
        //   $scope.error = error;
        // });
      }).error(function(error) {
        $scope.error = error;
      });
    }



  };

  $scope.checkData = function(app) {
    // check for empty fields
    if (!app.name || !app.description || !app.selectedkey) {
      $scope.emptyDataMessage = 'All fields are required.';
      return false;
    }
    return true;
  };

  $scope.addAppPage = function() {
    $scope.newAppForm = true;
  };

  $scope.listApps = function() {

    $http.get('/user/' + userId + '/app/listApps').success(function(response) {
      $scope.apps = response.data;
    }).error(function(error) {
      $scope.error = error;
    });
  };

  // /user/:userId/app/:appId/getOneApp
  // /user/:userId/app/:appId/update
  // /user/:userId/app/:appId/delete
  // 
  $scope.deleteApp = function(app, apps, index) {
    apps.splice(index, 1);
    $http.delete('/user/' + userId + '/app/' + app._id + '/delete').success(function(response) {
      $scope.newKey = response.data;
    }).error(function(error) {
      $scope.error = error;
    });
  };
  $scope.addKey = function() {
    $http.post('/user/' + userId + '/addKey').success(function(response) {
      $scope.newKey = response.data;
    }).error(function(error) {
      $scope.error = error;
    });
  };



  $scope.listKeys = function() {
    $http.get('/user/' + userId + '/Keys').success(function(response) {
      $scope.userKeys = response.data;
    }).error(function(error) {
      $scope.error = error;
    });
  };


  // $scope.onFileSelect = function($files) {
  //   $scope.files = $files;
  //   $scope.imageFiles = [];
  //   $scope.stringFiles = [];
  //   if ($scope.files) {
  //     for (var i in $scope.files) {
  //       if ($scope.files[0].type === 'application/pdf' || $scope.files[0].type === 'application/msword' || $scope.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || $scope.files[i].size < 600000) {
  //         $scope.correctFormat = true;
  //       } else {
  //         alert('error');
  //         alert('Wrong file format...');
  //         $scope.correctFormat = false;
  //       }
  //       $scope.start(i);

  //     }
  //   }
  // };
});
