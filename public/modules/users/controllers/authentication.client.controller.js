'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				//data-ng-submit="signin()" is put in the html to say that the signin function in this controller is the one to run
				//this then initiates the post request to /auth/signin which will then be handled by the node server
				//it will then take the response and set the authentication.user equal to that response and redirect to the / page or index
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);