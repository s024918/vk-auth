var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.put('/api/publish-slide', function(req, res) {
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
						
						models.Slide
						.findAll({ 
							where: {
								topicId: param.topicId
							}
							// ,include: [
								// { model: models.Topic, include: [ { model: models.Lesson, where: { userId: user.id } } ] } // Bug in Sequelize, what a stupid ORM no?
							// ]
						})
						.then(function(slides) {
							models.Topic
							.findOne({
								where: {
									id: param.topicId
								},
								include: [
									{ model: models.Lesson, where: { userId: user.id  } }
								]
							})
							.then(function(topic) {
								if (!topic) {
									errorDictionary["publishError"] = "Why are you lying sherlok?!";
									model.errors = errorDictionary;
									return res.status(400).json(model);
								}
								
								successUpdateCallback(topic);
							});
							
							function successUpdateCallback(topic) {
								if (slides.length <= 0) {
									errorDictionary["publishError"] = "Impossible to publish this slide!";
									model.errors = errorDictionary;
									return res.status(400).json(model);
								}

								if (topic.Lesson.isPublished && slides.filter(function(value){ return value.isPublished===true;}).length === 1 && !param.publishState) {
									errorDictionary["publishError"] = "Impossible to unpublish this slide because this is the last published slide of the active lesson topic! ";
									model.errors = errorDictionary;
									return res.status(400).json(model);
								}

								models.Slide
								.update({
									isPublished: param.publishState
								}, {
									where: {
										id: param.slideId
									}
								})
								.then(function(slide) {
									res.json(model);
								});
							}
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