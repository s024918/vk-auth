var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var editLessonValidator = require('./edit-lesson.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/edit-lesson', function(req, res) {
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
						
						models.Lesson
						.findOne({
							where: {
								id: param.lessonId,
								userId: user.id
							},
							include: [
								{ model: models.Level },
								{ model: models.ProgrammingLanguage },
								{ model: models.User },
								{ model: models.Topic, include: [ models.Slide ] }
							],
							order: [
								[ models.Topic, 'sequenceNumber', 'ASC' ]
							]
						})
						.then(function(lesson) {
							if (!lesson) {
								return res.json(model);
							}
							
							model.lesson = {
								id: lesson.id,
								name: lesson.name,
								description: lesson.description,
								levelId: lesson.levelId,
								levelName: lesson.Level.name,
								programmingLanguageId: lesson.ProgrammingLanguage.id,
								programmingLanguageName: lesson.ProgrammingLanguage.name,
								topics: lesson.Topics,
							};

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
	
	app.put('/api/edit-lesson', function(req, res) {
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
						
						var errorDictionary = editLessonValidator(param);
						if (Object.keys(errorDictionary).length > 0) {
							model.errors = errorDictionary;
							res.status(400).json(model);
						}
						else {
							models.Lesson
							.update({
								name: param.name,
								description: param.description,
								levelId: param.levelId,
								programmingLanguageId: param.programmingLanguageId
							},
							{ where: { id: param.id, userId: user.id } })
							.then(function(lesson) {
								res.json(model);
							});
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