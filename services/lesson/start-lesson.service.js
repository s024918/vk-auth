var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.get('/api/start-lesson', function(req, res) {
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
								isPublished: true
							},
							include: [
								{ model: models.Level },
								{ model: models.ProgrammingLanguage },
								{ model: models.User },
								{ model: models.Topic, where: { isPublished: true }, include: [ models.Slide ] }
							],
							order: [
								[ models.Topic, 'sequenceNumber', 'ASC' ]
							]
						})
						.then(function(lesson) {
							if (!lesson) {
								return res.json(model); // unexpected param returns null
							}
							
							model.lesson = {
								name: lesson.name,
								description: lesson.description,
								level: lesson.Level.name,
								topics: lesson.Topics,
								teacher: lesson.User.firstname + " " + lesson.User.lastname,
							};

							for (var i = 0; i < lesson.Topics.length; i++) {
								models.UserLessonHistory
								.findOrCreate({
									where: {
										userId: user.id,
										topicId: lesson.Topics[i].id
									},
									defaults: {
										userId: user.id,
										topicId: lesson.Topics[i].id,
										slideId: lesson.Topics[i].Slides[0].id
									}
								}); // Async for the purpose
							}
							
								

							console.log("Hiustonai? " + JSON.stringify(lesson));
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