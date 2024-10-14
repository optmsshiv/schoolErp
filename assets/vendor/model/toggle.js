/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./model/toggle.js":
/*!*************************!*\
  !*** ./model/toggle.js ***!
  \*************************/
/***/ (function() {

eval("// Toggle Switch\ndocument.querySelector('.toggle-switch').addEventListener('click', function () {\n  this.classList.toggle('active');\n});\n\n// Menu Toggle Behavior\ndocument.querySelectorAll('.menu-toggle').forEach(function (item) {\n  item.addEventListener('click', function () {\n    // Remove active class from all menu items\n    document.querySelectorAll('.menu-item').forEach(function (menuItem) {\n      menuItem.classList.remove('active');\n    });\n\n    // Add active class to the clicked menu item\n    this.parentElement.classList.add('active');\n  });\n});\n\n// jQuery Document Ready\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/toggle.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/toggle.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});