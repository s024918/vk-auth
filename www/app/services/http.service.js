app.service("httpService", ["$http", function ($http) {
    this.get = function (controllerApi) {
        return $http.get("/api/" + controllerApi);
    };
    this.getRaw = function (raw) {
        return $http.get(raw);
    };
    this.getByID = function (controllerApi, id) {
        return $http.get("/api/" + controllerApi + "/" + id);
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
}]);