(function() {
	'use strict';

	app.controller("UserMainCtrl", ["$scope", "$location", "httpService",
		function ($scope, $location, httpService) {
			$scope.profileFieldset = "account_information";
		}
	]);
})();
