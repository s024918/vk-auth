(function() {
	'use strict';

	app.controller("UserStartLessonCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
			
            var config = {
                params: {
					lessonId: $routeParams.id,
				}
            };

            httpService.getWithAuth("/api/start-lesson", config, $scope);
			$scope.authSuccessCallback = function () {
				$rootScope.user = $scope.data.userData;
			}
			
			$scope.startTopic = function (topicId) {
				$location.path("/user/start-topic/" + topicId);
			}
		}
	]);
})();
