(function() {
	'use strict';

	app.controller("RegisterCtrl", ["$scope", "httpService", "$location",
		function ($scope, httpService, $location) {
			$scope.submitRegister = function () {
				$scope.errors = [];
				
				var account = {
					roleId: $scope.roleId,
					firstname: $scope.firstname,
					lastname: $scope.lastname,
					email: $scope.email,
					password: $scope.password,
					confirmPassword: $scope.confirmPassword
				};
				
				var promisePost = httpService.post("register", account);
				promisePost.then(function (data) {
					$location.path('/login');
				},
				function (response) {
					$scope.errors = response.data;
				});
			};
		}
	]);
})();
