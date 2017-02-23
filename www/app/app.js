'use strict';

var app = angular.module('vk-auth', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule']);

app.run(["$rootScope", "localStorageService", function ($rootScope, localStorageService) {
    $rootScope.user = localStorageService.get('vk-auth');
}]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: "HomeCtrl",
        templateUrl: "App/vk-auth/home/home.html"
    });
	
	$routeProvider.when("/login", {
        controller: "LoginCtrl",
        templateUrl: "App/vk-auth/login/login.html"
    });
	
	$routeProvider.when("/user/logout", {
        controller: "LogoutCtrl",
		templateUrl: "App/vk-auth/logout/logout.html"
    });
	
	$routeProvider.when("/register", {
        controller: "RegisterCtrl",
        templateUrl: "App/vk-auth/register/register.html"
    });
	
	$routeProvider.when("/user/main", {
        controller: "UserMainCtrl",
        templateUrl: "App/vk-auth/user/main/main.html"
    });

    $routeProvider.otherwise({
        controller: "404Ctrl",
        templateUrl: "App/vk-auth/404/404.html"
    });

    $locationProvider.html5Mode(true);
}]);

