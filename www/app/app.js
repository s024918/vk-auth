'use strict';

var app = angular.module('vk-auth', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: "HomeCtrl",
        templateUrl: "App/vk-auth/home/home.html"
    });
	
	$routeProvider.when("/login", {
        controller: "LoginCtrl",
        templateUrl: "App/vk-auth/login/login.html"
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

