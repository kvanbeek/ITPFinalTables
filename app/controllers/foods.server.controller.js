'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Food = mongoose.model('Food'),
    User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Food
 */
exports.create = function(req, res) {

    var food = new Food(req.body);
    food.user = req.user._id;

    console.log(food._id);

    var user = req.user;
    user.food.push(food._id);

    // var user = req.user;
    // user.food._id(food);
    // var user = req.user;
    // user.food =
    //*********************************************************************************
    //changed this from food.save to user.save so food would save as user
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


    food = _.extend(food , req.body);

    food.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(food);
        }
    });
};

/**
 * Show the current Food
 */
exports.read = function(req, res) {
	res.jsonp(req.food);
};

/**
 * Update a Food
 */
exports.update = function(req, res) {
	var food = req.food ;

	food = _.extend(food , req.body);

	food.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(food);
		}
	});
};

/**
 * Delete an Food
 */
exports.delete = function(req, res) {
	var food = req.food ;

	food.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(food);
		}
	});
};

/**
 * List of Foods
 */
exports.list = function(req, res) {
    //*********************************************************************************
    // Customer.find({user: req.user}).exec(function(err, customers) {
    //this was customer.find but I changed it to user so it wasn't an issue and only queried for a given user
    //in order for it to work I added a customer reference to the model instead of customer just having
    //a reference to the user
    //Maybe I won't need the reference of customer to user?
    //*********************************************************************************
    console.log('*******************************************************');
    console.log(req.user._id);
    User.find(req.user._id).populate('food').exec(function(err, foods) {
        console.log(foods);
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log(foods);
            res.jsonp(foods[0].food);
            //it seems that it only has to give back a json response because angular views are in charge of rendering
            //that response
            //this json file is produced as a list then to access then go into customers which is a list then parse those items
        }
    });
};

/**
 * Food middleware
 */
exports.foodByID = function(req, res, next, id) { 
	Food.findById(id).populate('user', 'displayName').exec(function(err, food) {
		if (err) return next(err);
		if (! food) return next(new Error('Failed to load Food ' + id));
		req.food = food ;
		next();
	});
};

/**
 * Food authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.food.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
