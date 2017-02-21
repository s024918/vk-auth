var express = require('express');
var app = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , CustomStrategy = require('passport-custom').Strategy;

app.use(passport.initialize());
app.use(passport.session());
  
var Connection = require('sequelize-connect');
 console.log(__dirname);
var discover = [__dirname + '/models'];
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

var initAppConfiguration = require('./app.configuration');
initAppConfiguration(express, app);


var Promise = require('bluebird');

Promise.resolve(orm).then(function(instance) {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	  },
	  function(username, password, done) {
			instance.models.User.findOne({ where: { email: username, password: password }}).then(function(user) {
				if (!user) {
					return done(null, false, { message: 'Invalid user data.' });
				}
				
				return done(null, user);
			});
		}
	));
	
	// passport.use(new CustomStrategy(
  // function(req, done) {
	  // console.log("req?: " + req);
    // console.log("done?: " + done);
  // }
// ));
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		instance.models.User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	

	var initLoginService = require('./services/login/login.service');
	initLoginService(app, instance.sequelize, instance.models);
	
	var initRegisterService = require('./services/register/register.service');
	initRegisterService(app, instance.sequelize, instance.models);
});


