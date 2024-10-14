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

/***/ "./model/offCanvas.js":
/*!****************************!*\
  !*** ./model/offCanvas.js ***!
  \****************************/
/***/ (function() {

eval("document.addEventListener(\"DOMContentLoaded\", function () {\n  fetch(\"../model/offCanvas.html\").then(function (response) {\n    return response.text();\n  }).then(function (data) {\n    document.getElementById(\"offcanvasPlaceholder\").innerHTML = data;\n  });\n});\n\n/**********Data table js*****************/\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/offCanvas.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/offCanvas.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});