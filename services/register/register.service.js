module.exports = function (app, sequelize, models) {
	app.post('/api/register', function(req, res) {
		for(var key in req.body) {
  if(req.body.hasOwnProperty(key)){
    console.log(key + " " + req.body[key]);
  }
}
		
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
		// sequelize.sync().then(function() {
			// return models.User.create(req.body);
		// }).then(function(data) {
			// console.log(data.get({ plain: true }));
		// });
		// if (!isCreated)
			// res.json("ccc");
		// res.json(req.body);
	});
};