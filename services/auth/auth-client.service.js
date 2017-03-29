var soap = require('soap');
var url = 'http://localhost:8001/auth?wsdl';

module.exports = function (data, model, callback) {
	soap.createClient(url, function(error, client) {
		if (error) {
			console.log(error);
		}
		
		var soapParam = {}; // I love workarounds <3
		if (data.hasOwnProperty('token')) {
			soapParam.token = data.token;
			soapParam.nothing = "";
		}
		else {
			soapParam.email = data.email;
			soapParam.password = data.password;
		}
		
		client.describe().authService.authPort;
		client.memorize(soapParam, function(err, token) {
				if (err) {
					console.log(err);
				}
				
				// Response from web service
				model.token = token;
				callback(data);
				
		});
	});
};