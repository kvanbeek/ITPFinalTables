'use strict';

// Configuring the Articles module
angular.module('tables').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tables', 'tables', 'dropdown', '/tables(/create)?');
		Menus.addSubMenuItem('topbar', 'tables', 'List Tables', 'tables');
	}
]);
