(function() {
	'use strict';

	app.controller("UserMainCtrl", ["$scope", "$rootScope", "$location", "httpService", "localStorageService", "filterFilter",
		function ($scope, $rootScope, $location, httpService, localStorageService, filterFilter) {
			$scope.authSuccessCallback = function authSuccessCallback () {
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
				httpService.postWithAuth("/api/create-lesson", postConfig, $scope.authSuccessCallback, $scope.addLessonResult);
			}
			
			$scope.deleteLesson = function (lesson) {
				var postConfig = {
					id: lesson.id
				};
				function deleteLessonCallback(isStatusOk, result) {
					if (isStatusOk) {
						if (result.isDeleted === 1) {
							var index = $scope.data.lessons.indexOf(lesson);
							$scope.data.lessons.splice(index, 1);
						}						
					}
				}
				
				httpService.postWithAuth("/api/delete-lesson", postConfig, deleteLessonCallback, $scope.deleteLessonResult);
			}
			
			$scope.setLessonPublishState = function (lesson) {
				lesson.isPublished = !lesson.isPublished; // TODO: need callback like deleteLesson has. everywhere should be like that
				
				var postConfig = {
					id: lesson.id,
					publishState: lesson.isPublished
				};
				
				
				httpService.postWithAuth("/api/publish-lesson", postConfig, $scope.authSuccessCallback, $scope.publishStateLessonResult);
			}
			
			$scope.startLesson = function (lessonId) {
				$location.path("/user/start-lesson/" + lessonId);
			}
			
			$scope.profileFieldset = "account_information";
		}
	]);
})();
