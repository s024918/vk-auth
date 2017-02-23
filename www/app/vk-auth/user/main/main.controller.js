(function() {
	'use strict';

	app.controller("UserMainCtrl", ["$scope", "$location", "httpService", "localStorageService", "$http",
		function ($scope, $location, httpService, localStorageService, $http) {
			
            var config = {
                params: {
					businessLogic: 123,
				}
            };

            httpService.getWithAuth("/api/login", config);
			
			$scope.profileFieldset = "account_information";
		}
	]);
})();
