var soap = require('soap');
var url = 'http://localhost:8001/auth?wsdl';

module.exports = function (data, apiResponse, model) {
	soap.createClient(url, function(error, client) {
		if (error) {
			console.log(error);
		}
		
		client.describe().authService.authPort;
		client.memorize(data, function(err, token) {
				if (err) {
					console.log(err);
				}
				
				model.token = token;
				// Response from web service
				console.log(token);
				apiResponse.json(model);
		});
	});
};