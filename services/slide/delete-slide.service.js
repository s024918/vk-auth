var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.post('/api/delete-slide', function(req, res) {
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
								{ model: models.Topic, where: { id: param.topicId }, include: [ { model: models.Slide } ] }
							]
						})
						.then(function(lesson) {
							if (!lesson) {
								errorDictionary["deleteError"] = "Impossible to delete this slide because you are not the slide owner or slide is already deleted!";
								model.errors = errorDictionary;
								return res.status(400).json(model);
							}
							
							console.log("sssssssssssssssssssssss" + JSON.stringify(lesson));
							
							if (lesson.isPublished // Do not let to delete if lesson is published
							&& lesson.Topics[0].isPublished // Do not let to delete if topic is published
							&& lesson.Topics[0].Slides.find(o => o.id === param.slideId).isPublished // and Do not let to delete if slide itself is published
							&& lesson.Topics[0].Slides.filter(function(value){ return value.isPublished===true;}).length === 1) { // and Do not let to delete if only one slide is published all in all
								errorDictionary["deleteError"] = "Impossible to delete this slide because its lesson is published and this is the last slide for this topic! Unpublish your lesson in order to delete this lesson!";
								model.errors = errorDictionary;
								return res.status(400).json(model);
							}

							models.Slide
							.destroy({
								where: {
									id: param.slideId
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