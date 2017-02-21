(function() {
	'use strict';

	app.controller("UserMainCtrl", ["$scope", "$location", "httpService",
		function ($scope, $location, httpService) {
			var promiseGet = httpService.getRaw("http://localhost:8002/api/auth");

				promiseGet.then(function (data) {
					console.log(data);
				},
				function (error) {
					$scope.errors = error;
				});
			
			$scope.profileFieldset = "account_information";
		}
	]);
})();
