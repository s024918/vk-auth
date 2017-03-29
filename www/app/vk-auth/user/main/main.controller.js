(function() {
	'use strict';

	app.controller("UserMainCtrl", ["$scope", "$rootScope", "$location", "httpService", "localStorageService", "filterFilter",
		function ($scope, $rootScope, $location, httpService, localStorageService, filterFilter) {
			$scope.getStudentMain = function () {
				var config = {
					params: {
						businessLogic: 123, // When I name variable businessLogic this means variable will never be used for real and represents possible TODO implementation
					}
				};
				
				function getStudentMainCallback(isStatusOk, result) {
					$scope.lessons = result.lessons;
				}
				
				httpService.getWithAuth("/api/student-main", config, getStudentMainCallback);
			}
			
			$scope.getTeacherMain = function () {
				var config = {
					params: {
						businessLogic: 123, // When I name variable businessLogic this means variable will never be used for real and represents possible TODO implementation
					}
				};
				
				function getTeacherMainCallback(isStatusOk, result) {
					$scope.lessons = result.lessons;
				}
				
				httpService.getWithAuth("/api/teacher-main", config, getTeacherMainCallback);
			}
			
			$scope.createLesson = function () {
				$location.path("/user/create-lesson");
			}
			
			$scope.deleteLesson = function (lesson) {
				var config = {
					id: lesson.id
				};
				
				function deleteLessonCallback(isStatusOk, result) {
					if (isStatusOk) {
						if (result.isDeleted === 1) {
							var index = $scope.lessons.indexOf(lesson);
							$scope.lessons.splice(index, 1);
						}						
					}
				}
				
				httpService.postWithAuth("/api/delete-lesson", config, deleteLessonCallback);
			}
			
			$scope.setLessonPublishState = function (lesson) {
				var config = {
					id: lesson.id,
					publishState: angular.copy(!lesson.isPublished)
				};
				
				function putPublishLessonCallback(isStatusOk, result) {
					if (isStatusOk) {
						lesson.isPublished = !lesson.isPublished;						
					}
					else {
						alert(result.errors["publishError"]);
					}
				}
				
				httpService.putWithAuth("/api/publish-lesson", config, putPublishLessonCallback);
			}
			
			$scope.startLesson = function (lesson) {
				$location.path("/user/start-lesson/" + lesson.id);
			}
			
			$scope.editLesson = function (lesson) {
				$location.path("/user/edit-lesson/" + lesson.id);
			}
			
			$scope.profileFieldset = "account_information";
		}
	]);
})();
