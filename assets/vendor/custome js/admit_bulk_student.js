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

/***/ "./custome js/admit_bulk_student.js":
/*!******************************************!*\
  !*** ./custome js/admit_bulk_student.js ***!
  \******************************************/
/***/ (function() {

eval("document.getElementById('processButton').addEventListener('click', function () {\n  var fileInput = document.getElementById('inputGroupFile01');\n  var file = fileInput.files[0];\n  if (file && file.type === 'text/csv') {\n    var reader = new FileReader();\n    reader.onload = function (e) {\n      var text = e.target.result;\n      var rows = text.split('\\n');\n      var tableBody = document.querySelector('#dataTable tbody');\n      tableBody.innerHTML = ''; // Clear existing rows\n      rows.slice(1).forEach(function (row, index) {\n        // Skip the header row\n        if (row.trim() !== '') {\n          // Check if the row is not empty\n          var cols = row.split(',');\n          var tr = document.createElement('tr');\n\n          // Add S.No cell\n          var sNoCell = document.createElement('td');\n          sNoCell.textContent = index + 1; // Auto-generate S.No\n          tr.appendChild(sNoCell);\n          cols.forEach(function (col, colIndex) {\n            var td = document.createElement('td');\n            td.textContent = col;\n            if (colIndex === 12) {\n              // Assuming \"Father Name\" is the 13th column (index 12)\n              td.classList.add('nowrap');\n            }\n            tr.appendChild(td);\n          });\n          tableBody.appendChild(tr);\n        }\n      });\n    };\n    reader.readAsText(file);\n  } else {\n    alert('Please upload a valid CSV file.');\n  }\n});\ndocument.getElementById('resetButton').addEventListener('click', function () {\n  var tableBody = document.querySelector('#dataTable tbody');\n  tableBody.innerHTML = ''; // Clear the table data\n});\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./custome_js/admit_bulk_student.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./custome js/admit_bulk_student.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});