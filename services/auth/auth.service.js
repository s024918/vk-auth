var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('auth.wsdl', 'utf8');
var express = require('express');
var expressServer = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
 

// Add headers
expressServer.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
 
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
expressServer.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
expressServer.use(bodyParser.json());                                     // parse application/json
expressServer.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
expressServer.use(methodOverride());

var sessionMiddleware = session({resave: true, saveUninitialized: true, secret: 'hunter2'});
expressServer.use(sessionMiddleware);
expressServer.use(passport.initialize());
expressServer.use(passport.session());

var Connection = require('sequelize-connect');
 console.log(__dirname);
var discover = ['D:/git/vk-auth' + '/models'];
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

var Promise = require('bluebird');
Promise.resolve(orm).then(function(instance) {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	  },
	  function(username, password, done) {
		  console.log('very good response from the UDDI protocol');
			instance.models.User.findOne({ where: { email: username, password: password }}).then(function(user) {
				if (!user) {
					return done(null, false, { message: 'Invalid user data.' });
				}
				
				return done(null, user);
			});
		}
	));

	passport.serializeUser(function(user, done) {
		console.log(user.id);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		console.log("2a");
		instance.models.User.findById(id, function(err, user) {
			done(err, user);
		});
	});
});

var service = {
    authService : {
        authPort : {
            memorize: function (params, callback) {
				//Example POST method invocation 
				var Client = require('node-rest-client').Client;
				
				var client = new Client();
				
				// set content-type header and data as json in args parameter 
				var args = {
					data: { email: params.email, password: params.password },
					headers: { "Content-Type": "application/json" },
					requestConfig: {
						timeout: 1000, //request timeout in milliseconds 
						noDelay: true, //Enable/disable the Nagle algorithm 
						keepAlive: true, //Enable/disable keep-alive functionalityidle socket. 
						keepAliveDelay: 1000 //and optionally set the initial delay before the first keepalive probe is sent 
					},
					responseConfig: {
					timeout: 1000 //response timeout 
					}
				};

				var clientPost = client.post("http://localhost:8002/api/setRestfulAuth", args, function (data, response) {
					console.log(response.headers.authorization);
					
					callback({
						userid: data.id, headers: response.headers
					});
				});
            }
        }
    }
};

expressServer.listen(8002, function () {
	console.log('SOAP protocol listening on port 8001!');
	console.log('RESTful protocol bridge of the SOAP listening on port 8002!');
});

function loggedIn(req, res, next) {
    if (req.user) {
		console.log(req.user.id);
        next();
    } else {
        console.log("session: false");
    }
}

expressServer.get('/api/auth', function(req, res) {
	console.log(req.user);
	
	var model = {"id": 1, "name": "Erikas Kontenis"};
	res.json(model);
});

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

expressServer.post('/api/setRestfulAuth', passport.authenticate('local'), function(req, res) {
	// Proof of the successful session
	//console.log(req.user);
	console.log(req.isAuthenticated());
	var cookies = parseCookies(req);
	console.log("cookies " + req.session);
	//request.headers.authorization = value; kaip realizuoti sita nesamone
	res.json(req.user);
});

var server = http.createServer(function(request,response) {
    response.end("404: Not Found: " + request.url);
});

server.listen(8001);
soap.listen(server, '/auth', service, xml);
