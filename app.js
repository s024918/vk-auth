var express = require('express');
var app = express();
var Promise = require('bluebird');
var Connection = require('sequelize-connect');
var discover = [__dirname + '/models'];
var orm = new Connection('vk-auth', 'root', '',
{
	dialect: "mysql",
	port:    3306
},
discover);

var initAppConfiguration = require('./app.configuration');
initAppConfiguration(express, app);

Promise.resolve(orm).then(function(instance) {
	var initLoginService = require('./services/login/login.service');
	initLoginService(app, instance.sequelize, instance.models);
	
	var initRegisterService = require('./services/register/register.service');
	initRegisterService(app, instance.sequelize, instance.models);
});


