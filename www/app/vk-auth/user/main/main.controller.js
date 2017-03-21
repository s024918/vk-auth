(function() {
	'use strict';

	app.controller("UserMainCtrl", ["$scope", "$rootScope", "$location", "httpService", "localStorageService",
		function ($scope, $rootScope, $location, httpService, localStorageService) {
			$scope.authSuccessCallback = function () {
				$rootScope.user = $scope.data.userData;
				console.log($rootScope.user);
			}
			
			$scope.getStudentMain = function () {
				var config = {
					params: {
						businessLogic: 123,
					}
				};

				httpService.getWithAuth("/api/student-main", config, $scope);
			}
			
			$scope.getTeacherMain = function () {
				var config = {
					params: {
						businessLogic: 123,
					}
				};

				httpService.getWithAuth("/api/teacher-main", config, $scope);
			}
			
			$scope.addLesson = function () {
				var postConfig = {
					businessLogic: "123"
				};
				httpService.postWithAuth("/api/create-lesson", postConfig, $scope, $scope.addLessonResult);
			}
			
			$scope.setLessonPublishState = function (lessonId, publishState) {
				var postConfig = {
					id: lessonId,
					publishState: publishState
				};
				httpService.postWithAuth("/api/publish-lesson", postConfig, $scope, $scope.addLessonResult);
			}
			
			$scope.startLesson = function (lessonId) {
				$location.path("/user/start-lesson/" + lessonId);
			}
			
			$scope.profileFieldset = "account_information";
		}
	]);
})();
