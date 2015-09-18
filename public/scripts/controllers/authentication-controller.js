app.controller('AuthenticationCtrl', ['$scope', '$http', '$location', '$stateParams',
    function($scope, $http, $location, $stateParams) {
        $scope.register = function() {
            $scope.signupMessage = '';
            if (!$scope.validate()) {
                return;
            }
            var user = {
                email: $scope.email,
                password: $scope.password,
                username: $scope.username
            };
            $scope.signup(user);
        };



        $scope.validate = function() {

            // check for empty registration params
            if (!$scope.username || !$scope.email || !$scope.password) {
                $scope.signupMessage = 'All fields are required.';
                return false;
            }

            // check if username is up to 5 characters
            if ($scope.username.length < 5) {
                $scope.signupMessage = 'Username must have a minimum of 5 characters.';
                return false;
            }
            // check if valid email was entered
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.email))) {
                $scope.signupMessage = 'Please enter a valid email.';
                return false;
            }
            // check password strength
            if (!(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{7,9}$/.test($scope.password))) {
                $scope.signupMessage = 'Password must be between 7 to 9 characters, must contain at least one uppercase letter, one lowercase letter, one special character, one number.';
                return false;
            }

            return true;
        };



        $scope.signup = function(user) {
            $http.post('/user/signup', user).success(function(response) {
                //If successful we assign the response to the global user model
                $scope.signupMessage = response.message;
                $scope.user = response;
            }).error(function(error) {
                console.log('error', error);
                $scope.signupMessage = "Registration not successful";
                return false;
            });
        };


        $scope.signin = function(user) {
            console.log('login first', user);
            $scope.credentials = user;
            $http.post('/user/signin', $scope.credentials).success(function(response) {
                //If successful we assign the response to the global user model
                $scope.user = response.data;
                console.log('/user/', $scope.user._id);
                // $location.url('/user/' + $scope.user._id);

            }).error(function(response) {
                $scope.errorPresent = true;
                $scope.error = response.data;
            });
        };

        $scope.resetpassword = function() {
            var stringedEmail = JSON.stringify({
                email: $scope.email
            });
            var email = JSON.parse(stringedEmail);
            $http.post('/user/forgotpassword', email).success(function(response) {
                $location.url('/verify/email/success');
            }).error(function(error) {
                $scope.error = error.data;
                console.log('error', error);
            });
        };

        $scope.validatePassword = function() {
            // check password strength
            if (!(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{7,9}$/.test($scope.password))) {
                $scope.forgotMessage = 'Password must be between 7 to 9 characters, must contain at least one uppercase letter, one lowercase letter, one special character, one number.';
                return false;
            }

            if ($scope.password != $scope.confirmPassword) {
                $scope.forgotMessage = 'The two passwords do not match';
            }

            return true;

        };

        $scope.changePassword = function() {
            $scope.changePasswordMessage = '';
            if (!$scope.validatePassword()) {
                return;
            }
            var passwordWithTokenObject = {
                confirmPassword: $scope.confirmPassword,
                password: $scope.password,
                token: $stateParams.token
            };
            $scope.changePasswordInBackend(passwordWithTokenObject);
        };

        $scope.changePasswordInBackend = function(passwordWithTokenObject) {
            var token = passwordWithTokenObject.token;
            var passwordObject = {
                confirmPassword: passwordWithTokenObject.confirmPassword,
                password: passwordWithTokenObject.password
            };
            $http.post('/user/changePassword/' + token, passwordObject).success(function(response) {
                $location.url('/signin');
            }).error(function(error) {
                $scope.error = error.message;
            });
        };
    }
]);