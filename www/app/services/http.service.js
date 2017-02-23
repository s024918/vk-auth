(function() {
	'use strict';
	
	app.service("httpService", ["$http", "localStorageService", "$rootScope",
		function ($http, localStorageService, $rootScope) {
			this.get = function (controllerApi) {
				return $http.get("/api/" + controllerApi);
			};
			this.getRaw = function (raw) {
				return $http.get(raw);
			};
			this.getByID = function (controllerApi, id) {
				return $http.get("/api/" + controllerApi + "/" + id);
			};
			this.getWithAuth = function (controllerApi, config) {
				var result;
				
				config.params.token = localStorageService.get('vk-auth');
				$http.get('/api/login', config)
					.success(function (data, status, headers, config) {
						if (!data.token.isAuthenticated) {
							$rootScope.user = null;
							localStorageService.set('vk-auth', null);
							return;
						}
						
						$rootScope.user = data.token;
						localStorageService.set('vk-auth', data.token);
						result = data;
					})
					.error(function (data, status, header, config) {
						console.log("Nereikia taip daryti...")
					});
					
				return result;
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