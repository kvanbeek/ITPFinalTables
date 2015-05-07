'use strict';

//Foods service used to communicate Foods REST endpoints
angular.module('foods')



    .factory('Foods', ['$resource',
        function($resource) {
            return $resource('foods/:foodId', { foodId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ])
    .factory('Notify', ['$rootScope', function($rootScope) {

        var notify = {};

        notify.sendMsg = function(msg, data){
            data = data || {};
            $rootScope.$emit(msg, data);

            console.log('Message has been sent');
        };

        notify.getMsg = function (msg, func, scope){
            var unbind = $rootScope.$on(msg, func);

            if (scope){
                scope.$on('destroy',unbind);
            }
        };

        return notify;//does this just validate and give any factory these functions to be used?



    }
    ]);
