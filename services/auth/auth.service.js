var soap = require('soap');
var wsdl = require('fs').readFileSync('auth.wsdl', 'utf8');
var express = require('express');
var expressServer = express();
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
var Connection = require('sequelize-connect');
var discover = [__dirname + '/../../models'];
var orm = new Connection(
'vk-auth',
'root',
'',
{
  dialect: "mysql",
  port:    3306
},
discover
);
var secretKey = "labai slaptas sifravimo raktas";

var service = {
    authService : {
        authPort : {
            memorize: function (params, callback) {
				if (params.token) {
					var parseToken = JSON.parse(params.token);
					jwt.verify(parseToken.key, secretKey, function(err, decoded) {
						if (err) {
							return callback({
								isAuthenticated: false, key: null
							}); // Incorrect token key || by passing null user token will be cleared
						}
						else {
							if (decoded.iat <= Math.floor(Date.now() / 1000)) { // Somewhy user was so inactive that his token expired
								return callback({
									isAuthenticated: false, key: null
								}); 
							}
							else {
								decoded.iat = Math.floor(Date.now() / 1000) + 60 * 60; // Basically, updating token key every time when user calling *ring ring
								var token = jwt.sign(decoded, secretKey);
								return callback({
									isAuthenticated: true, key: token, userData: decoded
								});
							}
						}
					});
				}
				else {
					Promise.resolve(orm).then(function(instance) {
							instance.models.User.findOne({ where: { email: params.email, password: params.password }}).then(function(user) { // TODO: implement user management queries to UDDI protocol
							if (!user) {
								return callback({
									isAuthenticated: false, key: null
								});
							}
							else {
								var userData = { email: user.email, password: user.password, firstname: user.firstname, lastname: user.lastname, iat: Math.floor(Date.now() / 1000) + 60 * 60 };
								var token = jwt.sign(userData, secretKey);
								return callback({
									isAuthenticated: true, key: token, userData: userData
								});
							}
						});
					});
				}
            }
        }
    }
};

var server = expressServer.listen(8001, function(){
      var soapServer = soap.listen(expressServer, '/auth', service, wsdl);
});