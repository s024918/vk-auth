var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
	app.get('/api/start-topic', function(req, res) {
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
						models.Topic
						.findOne({
							where: {
								id: param.topicId
							},
							include: [
								{ model: models.Slide },
								{ model: models.UserLessonHistory, where: { userId: user.id }, required: false }, // required for left join instead of inner.
								{ model: models.Lesson, where: { isPublished: true }, include: [ models.Level, models.User ] }
							],
							order: [
								[ models.Slide, 'sequenceNumber', 'ASC' ]
							]
						})
						.then(function(topic) {
							var callbackIterator = 0;
							models.Topic
							.findAll({ where: { lessonId: topic.lessonId }, include: [ { model: models.UserLessonHistory, where: { userId: user.id }}] })
							.then(function(topics) {
								if (topics.length > 1) {
									for (callbackIterator; callbackIterator < topics.length; callbackIterator++) {
										var isTopicFinished = topics[callbackIterator].UserLessonHistories.find(o => o.topicId === topics[callbackIterator].id).isTopicFinished;
										if (topics[callbackIterator].sequenceNumber < topic.sequenceNumber && !isTopicFinished) {
											var errorDictionary = {};
											errorDictionary["errorHeader"] = "Impossible to start topic before not finishing already on-learning topic.";
											res.status(400).json(errorDictionary);
											break;
										}
									}
								}
								else {
									callbackIterator = 1;
								}
								
								if (callbackIterator === topics.length) {
									successValidationCallback();
								}
							});
							
							function successValidationCallback() {
								model.topic = {
									name: topic.name,
									level: topic.Lesson.Level.name,
									teacher: topic.Lesson.User.firstname + " " + topic.Lesson.User.lastname,
									slidesLength: topic.Slides.length,
									slides: []
								};

								if (!topic.UserLessonHistory) { // null means user never entered topic
									model.topic.slides.push(topic.Slides[0]);
								}
								else {
									for (var i = 0; i < topic.Slides.length; i++) {
										model.topic.slides.push(topic.Slides[i]);
										if (topic.Slides[i].id === topic.UserLessonHistory.userId) {
											break;
										}
									}
								}
								console.log("Hiustonai? " + JSON.stringify(topic));
								res.json(model);
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
		
		soapClientAuthService(req.query, model, soapClientCallback);
	});
};