'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Food = mongoose.model('Food'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, food;

/**
 * Food routes tests
 */
describe('Food CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Food
		user.save(function() {
			food = {
				name: 'Food Name'
			};

			done();
		});
	});

	it('should be able to save Food instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Food
				agent.post('/foods')
					.send(food)
					.expect(200)
					.end(function(foodSaveErr, foodSaveRes) {
						// Handle Food save error
						if (foodSaveErr) done(foodSaveErr);

						// Get a list of Foods
						agent.get('/foods')
							.end(function(foodsGetErr, foodsGetRes) {
								// Handle Food save error
								if (foodsGetErr) done(foodsGetErr);

								// Get Foods list
								var foods = foodsGetRes.body;

								// Set assertions
								(foods[0].user._id).should.equal(userId);
								(foods[0].name).should.match('Food Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Food instance if not logged in', function(done) {
		agent.post('/foods')
			.send(food)
			.expect(401)
			.end(function(foodSaveErr, foodSaveRes) {
				// Call the assertion callback
				done(foodSaveErr);
			});
	});

	it('should not be able to save Food instance if no name is provided', function(done) {
		// Invalidate name field
		food.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Food
				agent.post('/foods')
					.send(food)
					.expect(400)
					.end(function(foodSaveErr, foodSaveRes) {
						// Set message assertion
						(foodSaveRes.body.message).should.match('Please fill Food name');
						
						// Handle Food save error
						done(foodSaveErr);
					});
			});
	});

	it('should be able to update Food instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Food
				agent.post('/foods')
					.send(food)
					.expect(200)
					.end(function(foodSaveErr, foodSaveRes) {
						// Handle Food save error
						if (foodSaveErr) done(foodSaveErr);

						// Update Food name
						food.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Food
						agent.put('/foods/' + foodSaveRes.body._id)
							.send(food)
							.expect(200)
							.end(function(foodUpdateErr, foodUpdateRes) {
								// Handle Food update error
								if (foodUpdateErr) done(foodUpdateErr);

								// Set assertions
								(foodUpdateRes.body._id).should.equal(foodSaveRes.body._id);
								(foodUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Foods if not signed in', function(done) {
		// Create new Food model instance
		var foodObj = new Food(food);

		// Save the Food
		foodObj.save(function() {
			// Request Foods
			request(app).get('/foods')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Food if not signed in', function(done) {
		// Create new Food model instance
		var foodObj = new Food(food);

		// Save the Food
		foodObj.save(function() {
			request(app).get('/foods/' + foodObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', food.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Food instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Food
				agent.post('/foods')
					.send(food)
					.expect(200)
					.end(function(foodSaveErr, foodSaveRes) {
						// Handle Food save error
						if (foodSaveErr) done(foodSaveErr);

						// Delete existing Food
						agent.delete('/foods/' + foodSaveRes.body._id)
							.send(food)
							.expect(200)
							.end(function(foodDeleteErr, foodDeleteRes) {
								// Handle Food error error
								if (foodDeleteErr) done(foodDeleteErr);

								// Set assertions
								(foodDeleteRes.body._id).should.equal(foodSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Food instance if not signed in', function(done) {
		// Set Food user 
		food.user = user;

		// Create new Food model instance
		var foodObj = new Food(food);

		// Save the Food
		foodObj.save(function() {
			// Try deleting Food
			request(app).delete('/foods/' + foodObj._id)
			.expect(401)
			.end(function(foodDeleteErr, foodDeleteRes) {
				// Set message assertion
				(foodDeleteRes.body.message).should.match('User is not logged in');

				// Handle Food error error
				done(foodDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Food.remove().exec();
		done();
	});
});