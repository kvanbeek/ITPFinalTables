'use strict';

(function() {
	// Foods Controller Spec
	describe('Foods Controller Tests', function() {
		// Initialize global variables
		var FoodsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Foods controller.
			FoodsController = $controller('FoodsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Food object fetched from XHR', inject(function(Foods) {
			// Create sample Food using the Foods service
			var sampleFood = new Foods({
				name: 'New Food'
			});

			// Create a sample Foods array that includes the new Food
			var sampleFoods = [sampleFood];

			// Set GET response
			$httpBackend.expectGET('foods').respond(sampleFoods);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.foods).toEqualData(sampleFoods);
		}));

		it('$scope.findOne() should create an array with one Food object fetched from XHR using a foodId URL parameter', inject(function(Foods) {
			// Define a sample Food object
			var sampleFood = new Foods({
				name: 'New Food'
			});

			// Set the URL parameter
			$stateParams.foodId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/foods\/([0-9a-fA-F]{24})$/).respond(sampleFood);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.food).toEqualData(sampleFood);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Foods) {
			// Create a sample Food object
			var sampleFoodPostData = new Foods({
				name: 'New Food'
			});

			// Create a sample Food response
			var sampleFoodResponse = new Foods({
				_id: '525cf20451979dea2c000001',
				name: 'New Food'
			});

			// Fixture mock form input values
			scope.name = 'New Food';

			// Set POST response
			$httpBackend.expectPOST('foods', sampleFoodPostData).respond(sampleFoodResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Food was created
			expect($location.path()).toBe('/foods/' + sampleFoodResponse._id);
		}));

		it('$scope.update() should update a valid Food', inject(function(Foods) {
			// Define a sample Food put data
			var sampleFoodPutData = new Foods({
				_id: '525cf20451979dea2c000001',
				name: 'New Food'
			});

			// Mock Food in scope
			scope.food = sampleFoodPutData;

			// Set PUT response
			$httpBackend.expectPUT(/foods\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/foods/' + sampleFoodPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid foodId and remove the Food from the scope', inject(function(Foods) {
			// Create new Food object
			var sampleFood = new Foods({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Foods array and include the Food
			scope.foods = [sampleFood];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/foods\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFood);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.foods.length).toBe(0);
		}));
	});
}());