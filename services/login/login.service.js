var passport = require('passport');
var headers = null;
module.exports = function (app, sequelize, models) {
	app.get('/api/login', function(req, res) {
		
		var Client = require('node-rest-client').Client;
		var client = new Client();
		// direct way 
		var args = {
    data: { test: "hello" }, // data passed to REST method (only useful in POST, PUT or PATCH methods) 
    path: { "id": 120 }, // path substitution var 
    parameters: { arg1: "hello", arg2: "world" }, // query parameter substitution vars 
    headers: headers // request headers 
};
		console.log(headers);
		client.get("http://localhost:8002/api/auth", args, function (data, response) {
			// parsed response body as js object 
			console.log(data);
			// raw response 
			//console.log(response);
		});
 
		
		//req.headers = headers;
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
				console.log(error);
			}
			
			client.describe().authService.authPort;
			client.memorize(data, function(err, res) {
					if (err) {
						console.log(err);
					}

					// Response from web service
					console.log(res);
					headers = res.headers
			});
		});
	}
};