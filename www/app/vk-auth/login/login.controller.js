(function() {
	'use strict';

	app.controller("LoginCtrl", ["$scope", "$location", "httpService",
		function ($scope, $location, httpService) {
			$scope.email = null;
			$scope.password = null;
			
			$scope.submitLogin = function () {
				$scope.errors = [];
				
				var account = {
					email: $scope.email,
					password: $scope.password
				};
				
				var promisePost = httpService.post("login", account);

				promisePost.then(function (data) {
					console.log(data);
					$location.path('/user/main');
				},
				function (error) {
					$scope.errors = error;
				});
			};
		}
	]);
})();
