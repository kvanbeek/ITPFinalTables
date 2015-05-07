'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Customer = mongoose.model('Customer'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Customer
 */
 
exports.create = function(req, res) {
	var customer = new Customer(req.body);
	customer.user = req.user._id;
	
	console.log(customer._id);
	
	var user = req.user;
	user.customer.push(customer._id);

	// var user = req.user;
	// user.customer._id(customer);
	// var user = req.user;
	// user.customer = 
	//*********************************************************************************
	//changed this from customer.save to user.save so customer would save as user 
	//*********************************************************************************
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('user was updated');
		}
	});


	customer = _.extend(customer , req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Show the current Customer
 */
exports.read = function(req, res) {
	res.jsonp(req.customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
	var customer = req.customer ;


	customer = _.extend(customer , req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
	var customer = req.customer ;

	customer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * List of Customers
 */

exports.list = function(req, res) { 
	//*********************************************************************************
	// Customer.find({user: req.user}).exec(function(err, customers) {
	//this was customer.find but I changed it to user so it wasn't an issue and only queried for a given user 
	//in order for it to work I added a customer reference to the model instead of customer just having 
	//a reference to the user
	//Maybe I won't need the reference of customer to user?
	//*********************************************************************************
	User.find(req.user).populate('customer').exec(function(err, customers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customers[0].customer);
			//it seems that it only has to give back a json response because angular views are in charge of rendering
			//that response
			//this json file is produced as a list then to access then go into customers which is a list then parse those items
		}
	});
};

/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) { 
	Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
		if (err) return next(err);
		if (! customer) return next(new Error('Failed to load Customer ' + id));
		req.customer = customer ;
		next();
	});
};

/**
 * Customer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.customer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
