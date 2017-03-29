var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');
var editSlideValidator = require('./edit-slide.validator');

module.exports = function (app, sequelize, models) {
	app.get('/api/edit-slide', function(req, res) {
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
						
						models.Slide
						.findOne({
							where: {
								id: param.id
							}
						})
						.then(function(slide) {
							if (!slide) {
								// Slide somehow don't exist.
								return res.json(model);
							}
							
							models.Topic
							.findOne({ where: { id: slide.topicId }, include: [ { model: models.Lesson, where: { userId: user.id }}] })
							.then(function(topic) {
								if (!topic) {
									// Impossible case but topic get deleted- but its probably huston trying to authorize not his own slide
									return res.json(model);
								}
								
								model.slide = {
									id: slide.id,
									topicId: slide.topicId,
									title: slide.title,
									description: slide.description,
									sequenceNumber: slide.sequenceNumber,
									answer: slide.answer
								};

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
		
		soapClientAuthService(req.query, model, soapClientCallback);
	});
	
	app.put('/api/edit-slide', function(req, res) {
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
						
						var errorDictionary = editSlideValidator(param);
						if (Object.keys(errorDictionary).length > 0) {
							model.errors = errorDictionary;
							res.status(400).json(model);
						}
						else {
							models.Slide
							.findOne({
								where: {
									id: param.id
								}
							})
							.then(function(slide) {
								if (!slide) {
								// Slide somehow don't exist.
								return res.json(model);
								}
								
								models.Topic
								.findOne({ where: { id: slide.topicId }, include: [ { model: models.Lesson, where: { userId: user.id }}] })
								.then(function(topic) {
									if (!topic) {
										// Impossible case but topic get deleted- but its probably huston trying to authorize not his own slide
										return res.json(model);
									}
									
									models.Slide
									.update({
										title: param.title,
										description: param.description,
										name: param.name,
										sequenceNumber: param.sequenceNumber,
										answer: param.answer
									},
									{ where: { id: param.id } })
									.then(function(slide) {
										res.json(model);
									});
								});
								
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