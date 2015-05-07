'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var foods = require('../../app/controllers/foods.server.controller');

	// Foods Routes
	app.route('/foods')
		.get(foods.list)
		.post(users.requiresLogin, foods.create);

	app.route('/foods/:foodId')
		.get(foods.read)
		.put(users.requiresLogin, foods.hasAuthorization, foods.update)
		.delete(users.requiresLogin, foods.hasAuthorization, foods.delete);

	// Finish by binding the Food middleware
	app.param('foodId', foods.foodByID);
};
