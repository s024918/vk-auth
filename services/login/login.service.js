module.exports = function (app, sequelize, models) {
	app.get('/api/login', function(req, res) {
		var model = {"id": 1, "name": "Erikas Kontenis"};
		res.json(model);
	});
	
	app.post('/api/login', function(req, res) {
		connectAuthService(req.body);
		res.json(req.body);
	});

	function connectAuthService(data) {
		var soap = require('soap');
		var url = 'http://localhost:8001/auth?wsdl';

		soap.createClient(url, function(error, client) {
			if (error) {
				throw error;
			}

			client.describe().authService.authPort;
			client.memorize(data, function(err, res) {
					if (err) {
						throw err;
					}

					// Response from web service
					console.log (res);
			});
		});
	}
};