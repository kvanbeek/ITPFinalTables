'use strict';

// Tables controller
angular.module('tables').controller('TablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tables',
	function($scope, $stateParams, $location, Authentication, Tables) {
		$scope.authentication = Authentication;

		// Create new Table
        $scope.tables = [];
        console.log($scope.tables);

        // console.log("Something was saved: " + localStorage.getItem('name'));

        if (localStorage.getItem('mytables') === null) {
            $scope.tables =[];
        }else{
            $scope.tables = JSON.parse(localStorage.getItem('mytables'));
        }


        console.log('the tables: ' + $scope.tables);



        $scope.updateTable = function (a) {

            console.log(a);
            //maybe if a is nil then i can negate this function

            console.log('Update table the id: ' + a.id);
            // $scope.tables[a.id] = a;
            // $scope.tables[a.id].top = a.top;
            console.log('Update table the id:'  + a.top);
            $scope.tables[a.id].top = a.top;
            $scope.tables[a.id].width = a.width;
            $scope.tables[a.id].height = a.height;
            $scope.tables[a.id].left = a.left;


            console.log('top for table:'  + $scope.tables[a.id].top);
            console.log('width for table:'  + $scope.tables[a.id].width);
            console.log('height for table:'  + $scope.tables[a.id].height);
            console.log('left for table:'  + $scope.tables[a.id].left);
            console.log($scope.tables);



        };

//could be issues with the array as some are deleted however id's may stay the same not certain in every scenario though
        $scope.updateTableServer = function(tableId){
            console.log('updating table with id: ' + tableId);

        };

        $scope.newTable = function (){
            var i = $scope.tables.length;
            var table = {
                id: i,
                height: '150px',
                width: '150px',
                left: '300px',
                top: '200px'
            };

            $scope.tables.push(table);
            console.log($scope.tables);

        };

        $scope.saveChanges = function(){


            var mytables = $scope.tables;

            // Put the object into storage
            localStorage.setItem('mytables', JSON.stringify(mytables));

            // Retrieve the object from storage
            var retrievedObject = localStorage.getItem('mytables');

            console.log('retrievedObject: ', JSON.parse(retrievedObject));

        };

        $scope.remove = function (table){
            var index = $scope.tables.indexOf(table);
            $scope.tables.splice(index, 1);
            console.log($scope.tables);

        };

        $scope.update = function (user){
            console.log('update ran with user:'  + user.name);

        };

        $scope.handleThisElement = function ($event, server) {
            // alert($event.target.id);
            var parentNode = $event.target.parentNode;

            var tableId = parentNode.parentNode.id;


            $scope.tables[tableId].server = server.name;
            console.log($scope.tables[tableId]);

            var newElement = angular.element($event.currentTarget);
            var parent = newElement.parent();
            parent.css('visibility', 'hidden');

            // var id = card.data('id');
            // console.log("the card id is: " + id);

            // angular.element(item).data('id');



        };

	}
]).directive('resizable', ['$document', function ($document) {
    return {
        restrict: 'A',
        scope: {
            callback: '&onResize'

        },
        link: function (scope, elem, attrs) {

            //something is happening here that is resetting the size
            var testing;

            if (localStorage.getItem('mytables') === null) {
                testing = 0;
            }else{
                testing = JSON.parse(localStorage.getItem('mytables'));
            }

            console.log('Testing lenght:' + testing.length);



            var result = document.getElementById('container');
            var wrappedResult = angular.element(result);
            var number = wrappedResult.children().length - 1;
            console.log('Number of children:'  + number);
            console.log('Number of elements in storage: ' + testing.length);
            //gets the number of elements so this element can be assigned with that number




            elem.addClass('draggable');

            elem.resizable();

            elem.draggable({
                containment: '#container',
                stack: '#container md-card'
            });



            var table;

            if (testing.length > number){
                console.log('less than');
                table = {
                    id: number,
                    height: testing[number].height,
                    width: testing[number].width,
                    left: testing[number].left,
                    top: testing[number].top
                };

            }else{
                console.log('else occured');
                table = {
                    id: number,
                    height: '150px',
                    width: '150px',
                    left: '300px',
                    top: '200px'
                };
            }



            scope.callback({a: table});


            elem.on('mousedown', function(event) {

                $document.on('mouseup', mouseup);
            });

            function mouseup() {


                var table = {
                    id: number,
                    height: elem.css('height'),
                    width: elem.css('width'),
                    left: elem.css('left'),
                    top: elem.css('top')
                };

                console.log('within resizable directive height: ' + table.height);
                console.log('within resizable directive width: ' + table.top);


                $document.off('mouseup', mouseup);
                scope.callback({a: table});

            }

        }
    };
}])

//could add a doubleclick feature on container to activate the add in this directive to allow for double clicking to create element
    .directive('trash', ['$document', function ($document) {
        return {
            restrict: 'A',
            scope: {
                callback: '&onDelete'

            },
            link: function (scope, elem, attrs) {







                elem.on('mousedown', function(event) {
                    console.log(elem.parent());
                    // scope.callback();

                    elem.parent().remove();
                    // $document.on('mouseup', mouseup);
                    // scope.callback({id})
                });


            }
        };
    }]);
