var express = require('express');
//var Sequelize = require('sequelize');
//var sequelize = new Sequelize('vk-auth', 'root', '');
//var sequelize = new Sequelize('mysql://root:@localhost:3306/vk-auth');
var app = express();


var Connection 		= require('sequelize-connect');
 
var discover = [__dirname + '/models'];
console.log(__dirname);
var orm = new Connection(
'vk-auth',
'root',
'',
{
  dialect: "mysql",
  port:    3306
},
discover
);

var initAppConfiguration = require('./app.configuration');
initAppConfiguration(express, app);


var Promise = require('bluebird');

Promise.resolve(orm)
.then(function(instance) {
	var initLoginService = require('./services/login/login.service');
	initLoginService(app, instance.sequelize, instance.models);
	
	var initRegisterService = require('./services/register/register.service');
	initRegisterService(app, instance.sequelize, instance.models);
});
// var initloginservice = require('./services/login/login.service');
// initloginservice(app);


