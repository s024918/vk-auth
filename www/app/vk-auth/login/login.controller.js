(function() {
	'use strict';

	app.controller("LoginCtrl", ["$scope", "$rootScope", "$location", "httpService", "localStorageService",
		function ($scope, $rootScope, $location, httpService, localStorageService) {
			$scope.email = null;
			$scope.password = null;
			
			$scope.submitLogin = function () {
				$scope.errors = [];
				
				var account = {
					email: $scope.email,
					password: $scope.password
				};
				
				var promisePost = httpService.post("login", account);
				promisePost.then(function (response) {
					if (response.data.token.isAuthenticated === "false") {
						$rootScope.user = null;
						localStorageService.set('vk-auth', null);
						return;
					}
					
					$rootScope.user = response.data.token;
					localStorageService.set('vk-auth', response.data.token);
					$location.path('/user/main');
				},
				function (error) {
					$scope.errors = error;
				});
			};
		}
	]);
})();
