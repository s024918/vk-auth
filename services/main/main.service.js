var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.get('/api/student-main', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param) {
			if (model.token.isAuthenticated === "true") {
				models.User
				.findOne({ where: { hashId: model.token.key.userHashId }})
				.then(function(user) {
					if (!user) {
						res.json(null); // User account suddenly become deleted so he losses token
					}
					else {
						model.userData = {};
						model.userData.firstname = user.firstname;
						model.userData.lastname = user.lastname;
						model.token.key = jwt.sign(model.token.key, constants.SECRET_KEY);
						
						models.Lesson
						.findAll({ where: { isPublished: true }, include: [models.Level, models.ProgrammingLanguage, models.User, {model: models.Topic, include: [models.Slide]}]})
						.then(function(lessons) {
							model.lessons = [];
							for (var i = 0; i < lessons.length; i++) {
								model.lessons.push({ // Forming DTO
									id: lessons[i].id,
									name: lessons[i].name,
									description: lessons[i].description,
									teacher: lessons[i].User.firstname + " " + lessons[i].User.lastname,
									level: lessons[i].Level.name,
									programmingLanguage: lessons[i].ProgrammingLanguage.name
								});
							}

							res.json(model);
						});
					}
				});	
			}
			else {
				// TODO: 401 error
				res.json(null);
			}
		}
		
		soapClientAuthService(req.query, model, soapClientCallback);
	});
	
	app.get('/api/teacher-main', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param) {
			if (model.token.isAuthenticated === "true") {
				models.User
				.findOne({ where: { hashId: model.token.key.userHashId }})
				.then(function(user) {
					if (!user) {
						res.json(null); // User account suddenly become deleted so he losses token
					}
					else {
						model.userData = {};
						model.userData.firstname = user.firstname;
						model.userData.lastname = user.lastname;
						model.token.key = jwt.sign(model.token.key, constants.SECRET_KEY);
						
						models.Lesson
						.findAll({ where: { userId: user.id }, include: [models.Level, models.ProgrammingLanguage, models.User, {model: models.Topic, include: [models.Slide]}]})
						.then(function(lessons) {
							model.lessons = [];
							for (var i = 0; i < lessons.length; i++) {
								model.lessons.push({ // Forming DTO
									id: lessons[i].id,
									name: lessons[i].name,
									description: lessons[i].description,
									teacher: lessons[i].User.firstname + " " + lessons[i].User.lastname,
									level: lessons[i].Level.name,
									programmingLanguage: lessons[i].ProgrammingLanguage.name,
									isPublished: lessons[i].isPublished
								});
							}

							res.json(model);
						});
					}
				});	
			}
			else {
				// TODO: 401 error
				res.json(null);
			}
		}
		
		soapClientAuthService(req.query, model, soapClientCallback);
	});
};