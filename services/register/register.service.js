module.exports = function (app, sequelize, models) {
	app.post('/api/register', function(req, res) {
		if (req.body.password == null) {
			var responseMessage = {"errorPassword": "VeryWrongPassword"};
				res.status(400).json(responseMessage);
		}
		else {
			models.User
			.findOrCreate({where: {email: req.body.email}, defaults: req.body})
			.spread(function(user, created) {
				if (created) {
					res.json("gzgz");
				} else {
					var responseMessage = {"errorHeader": ["Username with such email already exists."]};
					res.status(400).json(responseMessage);
				}
			});		

		}
	});
};