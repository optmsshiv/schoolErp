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

/***/ "./model/datePicker.js":
/*!*****************************!*\
  !*** ./model/datePicker.js ***!
  \*****************************/
/***/ (function() {

eval("$(function () {\n  $('#bs-datepicker-daterange').datepicker({\n    format: 'dd/mm/yyyy',\n    autoclose: true,\n    todayHighlight: true\n  }).on('changeDate', function (e) {\n    // Highlight the range\n    var startDate = $('#bs-datepicker-daterange input').first().datepicker('getDate');\n    var endDate = $('#bs-datepicker-daterange input').last().datepicker('getDate');\n    if (startDate && endDate) {\n      var currentDate = new Date(startDate);\n      while (currentDate <= endDate) {\n        $('.datepicker-days td.day').filter(function () {\n          return $(this).text() == currentDate.getDate();\n        }).addClass('range');\n        currentDate.setDate(currentDate.getDate() + 1);\n      }\n    }\n  });\n});\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/datePicker.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/datePicker.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});