(function() {
	'use strict';

	app.controller("UserStartTopicCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
			
            var config = {
                params: {
					topicId: $routeParams.id,
				}
            };

            httpService.getWithAuth("/api/start-topic", config, $scope);
			$scope.authSuccessCallback = function (isStatusOk, result) {
				$rootScope.user = $scope.data.userData;
			}
		
		}
	]);
})();
