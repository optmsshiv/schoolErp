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

/***/ "./model/chart.js":
/*!************************!*\
  !*** ./model/chart.js ***!
  \************************/
/***/ (function() {

eval("var ctx = document.getElementById('myChart').getContext('2d');\nvar myChart = new Chart(ctx, {\n  type: 'bar',\n  data: {\n    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],\n    datasets: [{\n      label: 'Income Of the Year 2024',\n      data: [12, 19, 3, 5, 2, 3, 15, 8, 11, 8, 9, 22],\n      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],\n      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],\n      borderWidth: 1\n    }]\n  },\n  options: {\n    scales: {\n      y: {\n        beginAtZero: true\n      }\n    }\n  }\n});\n\n/***********pie chart  *************\n var options = {\n  series: [10, 5, 15], // Example data\n  chart: {\n    type: 'donut'\n  },\n  labels: ['Paid', 'Pending', 'Overdue'],\n  responsive: [{\n    breakpoint: 480,\n    options: {\n      chart: {\n        width: 200\n      },\n      legend: {\n        position: 'bottom'\n      }\n    }\n  }]\n};\n var chart = new ApexCharts(document.querySelector(\"#chart\"), options);\nchart.render();*/\n\n/**************pie chart classwiese****************/\nvar classData = {\n  1: [10, 5, 5],\n  // Example data for Class 1: Paid, Pending, Overdue\n  2: [8, 7, 5],\n  // Example data for Class 2: Paid, Pending, Overdue\n  3: [12, 3, 5] // Example data for Class 3: Paid, Pending, Overdue\n};\n\nvar options = {\n  series: [],\n  chart: {\n    type: 'pie'\n  },\n  labels: ['Paid', 'Pending', 'Overdue'],\n  title: {\n    text: ''\n  },\n  responsive: [{\n    breakpoint: 480,\n    options: {\n      chart: {\n        width: 200\n      },\n      legend: {\n        position: 'bottom'\n      }\n    }\n  }]\n};\nvar chart = new ApexCharts(document.querySelector(\"#chart\"), options);\nchart.render();\ndocument.getElementById('classSelect').addEventListener('change', function () {\n  var classValue = this.value;\n  if (classValue != 0) {\n    options.series = classData[classValue];\n    options.title.text = 'Class ' + classValue + ' Fee Status';\n    chart.updateOptions(options);\n  }\n});\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/chart.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/chart.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});