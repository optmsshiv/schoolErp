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

/***/ "./model/model.js":
/*!************************!*\
  !*** ./model/model.js ***!
  \************************/
/***/ (function() {

eval("// Load the modal HTML into the modalContainer div\nfetch('../model/model.html').then(function (response) {\n  return response.text();\n}).then(function (data) {\n  document.getElementById('modalContainer').innerHTML = data;\n\n  // Add event listener for the save button\n  document.getElementById('saveButton').addEventListener('click', function () {\n    var name = document.getElementById('modalName').value;\n    var fatherName = document.getElementById('modalFatherName').value;\n    var motherName = document.getElementById('modalMotherName').value;\n    var className = document.getElementById('modalClassName').value;\n    var phone = document.getElementById('modalPhone').value;\n    var dob = document.getElementById('modalDob').value;\n    var gender = document.getElementById('modalGender').value;\n    var address = document.getElementById('modalAddress').value;\n    var enquiryDate = document.getElementById('modalEnquiry').value;\n    if (name && fatherName && dob && phone && address && gender && enquiryDate) {\n      var table = document.getElementById('ModeldataTable');\n      var row = table.insertRow();\n      var serialNumber = table.rows.length;\n\n      // Format the date\n      var dateObj = new Date(dob);\n      var day = dateObj.getDate();\n      var month = dateObj.getMonth() + 1; // Months are zero-based\n      var year = dateObj.getFullYear();\n      var formattedDate = \"\".concat(day, \"-\").concat(month, \"-\").concat(year);\n\n      // Format the date\n      var enqDate = new Date(enquiryDate);\n      var days = enqDate.getDate();\n      var months = enqDate.getMonth() + 1; // Months are zero-based\n      var years = enqDate.getFullYear();\n      var enquireDate = \"\".concat(days, \"-\").concat(months, \"-\").concat(years);\n\n      // Insert new row\n      row.insertCell(0).innerHTML = serialNumber;\n      row.insertCell(1).innerText = name;\n      row.insertCell(2).innerText = fatherName;\n      row.insertCell(3).innerText = motherName;\n      row.insertCell(4).innerText = className;\n      row.insertCell(5).innerText = phone;\n      row.insertCell(6).innerText = formattedDate;\n      row.insertCell(7).innerText = gender;\n      row.insertCell(8).innerText = address;\n      row.insertCell(9).innerText = enquireDate;\n\n      // Clear the form fields\n      document.getElementById('modalForm').reset();\n\n      // Close the modal\n      var modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));\n      modal.hide();\n    } else {\n      alert('Please fill out all fields');\n    }\n  });\n});\n\n/******************************add canvas right****************/\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/model.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/model.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});