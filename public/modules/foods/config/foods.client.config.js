'use strict';

// Configuring the Articles module
angular.module('foods').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Menu', 'foods', 'dropdown', '/foods(/create)?');
		Menus.addSubMenuItem('topbar', 'foods', 'List Menu', 'foods');
	}
]);
