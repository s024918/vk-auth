// var User = module.exports = 
	// sequelize.define('users', {
		// firstname: Sequelize.STRING,
		// lastname: Sequelize.STRING,
		// email: Sequelize.STRING,
		// password: Sequelize.STRING
	// });
	
module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define("User", {
		firstname: DataTypes.STRING,
		lastname: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
	});
	
	return User;
};