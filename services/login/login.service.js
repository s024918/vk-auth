var soapClientAuthService = require(__dirname + '/../auth/auth-client.service');

module.exports = function (app, sequelize, models) {
	app.get('/api/login', function(req, res) {
		var model = {"id": 1, "name": "Erikas Kontenis"};
		soapClientAuthService(req.query, res, model);
	});
	
	app.post('/api/login', function(req, res) {
		soapClientAuthService(req.body, res, req.body);
	});
};