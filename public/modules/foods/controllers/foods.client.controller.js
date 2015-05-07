'use strict';

var foodsApp = angular.module('foods');
// Foods controller
foodsApp.controller('FoodsController', ['$scope', '$stateParams', 'Authentication', 'Foods', '$modal', '$log',
	function($scope, $stateParams, Authentication, Foods, $modal, $log) {
		this.authentication = Authentication;
        this.foods = Foods.query();
		// Create new Food

        this.modalCreate = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/foods/views/create-food.client.view.html',
                controller:  function ($scope, $modalInstance) {


                    $scope.okCreate = function () {
                        console.log('okCreate function activated');
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size

            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        this.modalUpdate = function (size, selectedFood) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/foods/views/edit-food.client.view.html',
                controller:  function ($scope, $modalInstance, food) {
                    $scope.food = food;

                    $scope.ok = function () {

                        $modalInstance.close($scope.food);


                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    food: function () {
                        return selectedFood;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        this.remove = function(food) {
            if ( food ) {
                food.$remove();

                for (var i in this.foods) {
                    if (this.foods [i] === food) {
                        this.foods.splice(i, 1);
                    }
                }
            } else {
                this.food.$remove(function() {
                });
            }
        };

//




	}
]);

foodsApp.controller('FoodsCreateController', ['$scope', 'Foods', 'Notify',
    function($scope, Foods, Notify) {

        // Create new Food
        this.create = function() {
            // Create new Food object
            console.log('create function started');
            var food = new Foods ({
                name: this.name,
                description: this.description,
                price: this.price,
                imageUrl: this.imageUrl

            });

            // Redirect after save
            food.$save(function(response) {

                Notify.sendMsg('NewFood', {'id': response._id});

                // Clear form fields
                //$scope.firstName = '';
                //$scope.surname = '';
                //$scope.suburb = '';
                //$scope.country = '';
                //$scope.industry = '';
                //$scope.email = '';
                //$scope.phone = '';
                //$scope.referred = '';
                //$scope.channel = '';

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


    }
]);

foodsApp.controller('FoodsEditController', ['$scope', 'Foods',
    function($scope, Foods) {
        this.update = function(updatedFood) {
            var food = updatedFood;

            food.$update(function() {
                //$location.path('food/' + food._id);
                console.log('Update was called');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

foodsApp.directive('foodList', ['Foods', 'Notify', function(Foods, Notify) {
    return {
        restrict: 'E',//restricts it to being an element
        transclude: true,
        templateUrl: 'modules/foods/views/food-list-template.html',
        link: function(scope, element, attrs){
            //when a new food is added update the food list
            Notify.getMsg('NewFood', function(event, data){

                scope.foodsCtrl.foods = Foods.query();
                //essentially this just waits for a new food to be created which emits NewFood
                //once new food is received basically it just queries again for the data
            });
        }
    };
}]);
