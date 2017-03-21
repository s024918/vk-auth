(function() {
	'use strict';
	
	app.service("httpService", ["$http", "localStorageService", "$rootScope", "$location",
		function ($http, localStorageService, $rootScope, $location) {
			this.get = function (controllerApi) {
				return $http.get("/api/" + controllerApi);
			};
			this.getRaw = function (raw) {
				return $http.get(raw);
			};
			this.getByID = function (controllerApi, id) {
				return $http.get("/api/" + controllerApi + "/" + id);
			};
			this.getWithAuth = function (controllerApi, config, scope) {
				config.params.token = localStorageService.get("vk-auth");
				$http.get(controllerApi, config)
					.success(function (data, status, headers, config) {
						scope.data = data;
						if (!data || !data.token || !data.token.isAuthenticated) {
							$rootScope.user = null;
							localStorageService.set("vk-auth", null);
							$location.path("/login");
						}
						else {
							localStorageService.set("vk-auth", data.token);
							scope.authSuccessCallback();
						}
					})
					.error(function (data, status, header, config) {
						console.log("Nereikia taip daryti...");
						scope.data = data;
					});
			};
			this.postWithAuth = function (controllerApi, config, callback) {
				config.token = JSON.stringify(localStorageService.get("vk-auth"));
				$http.post(controllerApi, config)
					.success(function (data, status, headers, config) {
						if (!data || !data.token || !data.token.isAuthenticated) {
							$rootScope.user = null;
							localStorageService.set("vk-auth", null);
							$location.path("/login");
						}
						else {
							localStorageService.set("vk-auth", data.token);
							callback(true, data);
						}
					})
					.error(function (data, status, header, config) {
						console.log("Nereikia taip daryti...");
						callback(false, data);
					});
			};
			this.post = function (controllerApi, item) {
				var request = $http({
					method: "post",
					url: "/api/" + controllerApi,
					data: item
				});
				return request;
			};
			this.put = function (controllerApi, id, item) {
				var request = $http({
					method: "put",
					url: "/api/" + controllerApi + "/" + id,
					data: item
				});
				return request;
			};
			this.delete = function (controllerApi, id) {
				var request = $http({
					method: "delete",
					url: "/api/" + controllerApi + "/" + id
				});
				return request;
			};
		}
	]);
})();