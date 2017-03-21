var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');
var constants = require(__dirname + '/../../app.constants');
var jwt = require('jsonwebtoken');

module.exports = function (app, sequelize, models) {
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
						
						models.Lesson
						.create({ userId: user.id, programmingLanguageId: 1, levelId: 1, name: "1", description: "1" })
						.then(function(lesson) {
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
		
		soapClientAuthService(req.body, model, soapClientCallback);
	});
};