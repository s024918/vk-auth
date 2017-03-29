var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.post('/api/delete-topic', function(req, res) {
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
						
						models.Lesson
						.findOne({
							where: {
								id: param.lessonId,
								userId: user.id // make sure user deleting his own topic
							},
							include: [
								{ model: models.Topic }
							]
						})
						.then(function(lesson) {
							if (!lesson) {
								errorDictionary["deleteError"] = "Impossible to delete this topic because you are not the topic owner or topic is already deleted!";
								model.errors = errorDictionary;
								return res.status(400).json(model);
							}
							
							if (lesson.isPublished // Do not let to delete if lesson is published
							&& lesson.Topics.find(o => o.id === param.topicId).isPublished // and Do not let to delete if topic itself is published
							&& lesson.Topics.filter(function(value){ return value.isPublished===true;}).length === 1) { // and Do not let to delete if only one topic is published all in all
								errorDictionary["deleteError"] = "Impossible to delete this topic because its lesson is published and this is the last topic for this lesson! Unpublish your lesson in order to delete this topic!";
								model.errors = errorDictionary;
								return res.status(400).json(model);
							}

							models.Topic
							.destroy({
								where: {
									id: param.topicId
								}
							})
							.then(function(isDeleted) {
								model.isDeleted = isDeleted;
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