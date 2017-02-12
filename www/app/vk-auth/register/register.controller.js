(function() {
	'use strict';

	app.controller("RegisterCtrl", ["$scope", "httpService",
		function ($scope, httpService) {
			$scope.myScope = 50001;
			
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
					console.log(data);
					//$location.path('/user/profile');
				},
				function (error) {
					$scope.errors = error;
				});
			};
		}
	]);
})();
