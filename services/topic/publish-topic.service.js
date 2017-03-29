var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.put('/api/publish-topic', function(req, res) {
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
								lessonId: param.lessonId
							},
							include: [
								{ model: models.Slide, where: { isPublished: true } },
								{ model: models.Lesson, where: { userId: user.id } }
							]
						})
						.then(function(topics) {
							if (!topics.find(o => o.id === param.topicId)) {
								errorDictionary["publishError"] = "Impossible to publish this topic because it has no published slides!";
								model.errors = errorDictionary;
								return res.status(400).json(model);
							}

							if (topics.filter(function(value){ return value.isPublished===true;}).length === 1 && !param.publishState) {
								errorDictionary["publishError"] = "Impossible to unpublish this topic because this is the last published topic with available published slides!";
								model.errors = errorDictionary;
								return res.status(400).json(model);
							}

							models.Topic
							.update({
								isPublished: param.publishState
							}, {
								where: {
									id: param.topicId
								}
							})
							.then(function(topic) {
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