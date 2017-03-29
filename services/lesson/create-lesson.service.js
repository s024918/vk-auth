var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var createLessonValidator = require('./create-lesson.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/create-lesson', function(req, res) {
		var model = {};
		
		var soapClientCallback = function (param) {
			if (model.token.isAuthenticated === "true") { // TODO: solid this code smell...
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
						
						res.json(model);
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
	
	app.post('/api/create-lesson', function(req, res) {
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
						
						var errorDictionary = createLessonValidator(param);
						if (Object.keys(errorDictionary).length > 0) {
							model.errors = errorDictionary;
							res.status(400).json(model);
						}
						else {
							if (user.roleId === constants.LECTURER) {
								models.Lesson
								.create({ userId: user.id, programmingLanguageId: param.programmingLanguageId, levelId: param.levelId, name: param.name, description: param.description })
								.then(function(lesson) {
									res.json(model);
								});
							}
							else {
								// TODO: You are not lecturer
								res.json(model);
							}
						}
					}
				});	
			}
			else {
				// TODO: 401 error
				res.json(null);
			}
		}
		
		soapClientAuthService(req.body, model, soapClientCallback);
	});
};