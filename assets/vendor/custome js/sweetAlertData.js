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

/***/ "./custome js/sweetAlertData.js":
/*!**************************************!*\
  !*** ./custome js/sweetAlertData.js ***!
  \**************************************/
/***/ (function() {

eval("document.getElementById('addButton').addEventListener('click', function () {\n  Swal.fire({\n    title: 'Add Information',\n    html: \"\\n          <input type=\\\"text\\\" id=\\\"swalName\\\" class=\\\"swal2-input\\\" placeholder=\\\"Full Name\\\">\\n          <input type=\\\"text\\\" id=\\\"swalFatherName\\\" class=\\\"swal2-input\\\" placeholder=\\\"Father's Name\\\">\\n          <input type=\\\"date\\\" id=\\\"swalDob\\\" class=\\\"swal2-input\\\">\\n        \",\n    focusConfirm: false,\n    preConfirm: function preConfirm() {\n      var name = document.getElementById('swalFullName').value;\n      var fatherName = document.getElementById('swalFatherName').value;\n      var dob = document.getElementById('swalDob').value;\n      if (name && fatherName && dob) {\n        var table = document.getElementById('SweetdataTable');\n        var row = table.insertRow();\n        row.insertCell(0).innerText = name;\n        row.insertCell(1).innerText = fatherName;\n        row.insertCell(2).innerText = dob;\n      } else {\n        Swal.showValidationMessage('Please fill out all fields');\n      }\n    }\n  });\n});\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./custome_js/sweetAlertData.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./custome js/sweetAlertData.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});