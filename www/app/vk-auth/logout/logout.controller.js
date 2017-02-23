(function() {
	'use strict';

	app.controller("LogoutCtrl", ["$rootScope", "$location", "httpService", "localStorageService",
		function ($rootScope, $location, httpService, localStorageService) {
			var account = {
					email: null,
					password: null
				};
				
			var promisePost = httpService.post("login", account);
			promisePost.then(function (response) {
				$rootScope.user = null;
					localStorageService.set('vk-auth', null);
					$location.path('/login');
			},
			function (error) {
				alert("nereikia taip daryti...");
			});
		}
	]);
})();
