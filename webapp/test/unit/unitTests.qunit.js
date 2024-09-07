/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"esegura/demo-northwind-1/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
