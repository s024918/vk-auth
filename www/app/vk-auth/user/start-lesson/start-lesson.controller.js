(function() {
	'use strict';

	app.controller("UserStartLessonCtrl", ["$scope", "$rootScope", "$location", "$routeParams", "httpService",
		function ($scope, $rootScope, $location, $routeParams, httpService) {
            var config = {
                params: {
					lessonId: $routeParams.id,
				}
            };

			function getStartLessonCallback(isStatusOk, result) {
				$scope.lesson = result.lesson;
			}
			
            httpService.getWithAuth("/api/start-lesson", config, getStartLessonCallback);
			
			$scope.startTopic = function (topicId) {
				$location.path("/user/start-topic/" + topicId);
			}
		}
	]);
})();
