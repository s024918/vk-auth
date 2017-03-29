module.exports = function (req) {
	var errors = {};
	
	if (!req.title) {
		errors["title"] = "Title field is required.";
	}
	
	if (!req.description) {
		errors["description"] = "Description field is required.";
	}
	
	return errors;
};