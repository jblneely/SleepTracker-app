angular.module('MyCtrls', ['MyServices'])
    .controller('HomeCtrl', ['$scope', 'Add', function($scope, Add) {
        $scope.add = [];

        add.query(function success(data) {
            $scope.add = data;
        }, function error(data) {
            console.log(data);
        });

        $scope.deleteADD = function(id, addIdx) {
            Add.delete({ id: id }, function success(data) {
                $scope.add.splice(addIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('ShowCtrl', ['$scope', '$stateParams', 'Add', function($scope, $stateParams, Add) {
        $scope.recipe = {};

        Add.get({ id: $stateParams.id }, function success(data) {
            $scope.add = data;
        }, function error(data) {
            console.log(data);
        });
    }])
    .controller('NewCtrl', ['$scope', '$location', 'Add', function($scope, $location, Add) {
        $scope.add = {
            title: '',
            description: '',
            image: ''
        };

        $scope.createAdd = function() {
            Add.save($scope.add, function success(data) {
                $location.path('/');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('NavCtrl', ['$scope', 'Auth', function($scope, Auth) {
        $scope.isLoggedIn = function() {
            return Auth.isLoggedIn();
        }

        $scope.logout = function() {
            Auth.removeToken();
        };
    }])
    .controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.user = {
            email: '',
            password: ''
        };
        $scope.userSignup = function() {
            $http.post('/api/users', $scope.user).then(function success(res) {
                console.log('successfully created a new user', res);
                $location.path('/'); //relocate to the home page
            }, function error(res) {
                console.log('Error while signing up', res);
            });
        };
    }])
    .controller('LoginCtrl', ['$scope', '$timeout', 'Auth', '$http', '$location', 'Alerts', function($scope, $timeout, Auth, $http, $location, Alerts) {
        $scope.user = {
            email: '',
            password: ''
        };
        var clearAlerts = function() {
            Alerts.clear();
        }

        $scope.userLogin = function() {
            $http.post('/api/auth', $scope.user).then(function success(res) {
                console.log('response from server when loggin in:', res);
                Auth.saveToken(res.data.token);
                Alerts.add('success', 'You are now logged in, congrats.');
                $timeout(clearAlerts, 1500);
                $location.path('/'); //redirect to home
            }, function error(res) {
                console.log('Something went wrong', res);
                Alerts.add('error', 'Bad Login Info, Please Try Again!!');
                $timeout(clearAlerts, 1500);
            });
        };
    }])
    .controller('AlertsController', ['$scope', 'Alerts', function($scope, Alerts) {
        $scope.alerts = function() {
            return Alerts.get();
        }
    }]);
