(function() {
	'use strict';

	app.controller("RegisterCtrl", ["$scope", "httpService", "$location",
		function ($scope, httpService, $location) {
			$scope.submitRegister = function () {
				$scope.errors = [];
				
				var account = {
					name: $scope.name,
					lastName: $scope.lastName,
					email: $scope.email,
					password: $scope.password,
					confirmPassword: $scope.confirmPassword
				};
				
				var promisePost = httpService.post("register", account);
				promisePost.then(function (data) {
					$location.path('/login');
				},
				function (error) {
					$scope.errors = error;
				});
			};
		}
	]);
})();
