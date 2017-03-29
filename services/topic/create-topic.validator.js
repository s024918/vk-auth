module.exports = function (req) {
	var errors = {};
	
	if (!req.name) {
		errors["name"] = "Name field is required.";
	}
	
	return errors;
};