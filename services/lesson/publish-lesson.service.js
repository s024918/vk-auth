var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.put('/api/publish-lesson', function(req, res) {
		var model = {};
		var errorDictionary = {};
		
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
						
						models.Topic
						.findAll({
							where: {
								lessonId: param.id,
								isPublished: true
							},
							include: [
								{ model: models.Slide, where: { isPublished: true } }
							]
						})
						.then(function(topics) {
							if (topics.length <= 0) {
								errorDictionary["publishError"] = "Impossible to publish this lesson because it has no published topics/lessons!";
								model.errors = errorDictionary;
								return res.status(400).json(model);
							}
							console.log("Hiustonai? " + JSON.stringify(topics));
							models.Lesson
							.update({
								isPublished: param.publishState
							}, {
								where: {
									id: param.id,
									userId: user.id
								}
							})
							.then(function(lesson) {
								res.json(model);
							});
							
						});
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