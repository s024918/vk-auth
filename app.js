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
	require('./models.configuration')(instance);
	
	var initLoginService = require('./services/login/login.service');
	initLoginService(app, instance.sequelize, instance.models);
	
	var initRegisterService = require('./services/register/register.service');
	initRegisterService(app, instance.sequelize, instance.models);
	
	var initMainService = require('./services/main/main.service');
	initMainService(app, instance.sequelize, instance.models);
	
	var initStartLessonService = require('./services/lesson/start-lesson.service');
	initStartLessonService(app, instance.sequelize, instance.models);
	
	var initCreateLessonService = require('./services/lesson/create-lesson.service');
	initCreateLessonService(app, instance.sequelize, instance.models);
	
	var initPublishLessonService = require('./services/lesson/publish-lesson.service');
	initPublishLessonService(app, instance.sequelize, instance.models);
	
	var initDeleteLessonService = require('./services/lesson/delete-lesson.service');
	initDeleteLessonService(app, instance.sequelize, instance.models);
	
	var initStartTopicService = require('./services/topic/start-topic.service');
	initStartTopicService(app, instance.sequelize, instance.models);
});


