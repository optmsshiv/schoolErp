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

/***/ "./model/collectionChart.js":
/*!**********************************!*\
  !*** ./model/collectionChart.js ***!
  \**********************************/
/***/ (function() {

eval("var options = {\n  series: [{\n    name: 'Nursery',\n    type: 'column',\n    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]\n  }, {\n    name: 'LKG',\n    type: 'area',\n    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]\n  }, {\n    name: 'UKG',\n    type: 'line',\n    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]\n  }, {\n    name: 'Class 1',\n    type: 'line',\n    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]\n  }, {\n    name: 'Class 2',\n    type: 'line',\n    data: [28, 22, 33, 29, 41, 32, 60, 50, 55, 34, 37]\n  }, {\n    name: 'Class 3',\n    type: 'column',\n    data: [32, 27, 38, 33, 47, 38, 68, 56, 62, 40, 43]\n  }, {\n    name: 'Class 4',\n    type: 'line',\n    data: [35, 30, 41, 36, 50, 41, 72, 60, 66, 44, 47]\n  }, {\n    name: 'Class 5',\n    type: 'line',\n    data: [38, 33, 44, 39, 53, 44, 76, 64, 70, 48, 51]\n  }, {\n    name: 'Class 6',\n    type: 'line',\n    data: [41, 36, 47, 42, 56, 47, 80, 68, 74, 52, 55]\n  }, {\n    name: 'Class 7',\n    type: 'line',\n    data: [44, 39, 50, 45, 59, 50, 84, 72, 78, 56, 59]\n  }, {\n    name: 'Class 8',\n    type: 'line',\n    data: [47, 42, 53, 48, 62, 53, 88, 76, 82, 60, 63]\n  }, {\n    name: 'Class 9',\n    type: 'line',\n    data: [50, 45, 56, 51, 65, 56, 92, 80, 86, 64, 67]\n  }, {\n    name: 'Class 10',\n    type: 'line',\n    data: [53, 48, 59, 54, 68, 59, 96, 84, 90, 68, 71]\n  }],\n  chart: {\n    height: 350,\n    type: 'line',\n    stacked: false\n  },\n  stroke: {\n    width: [0, 2, 5],\n    curve: 'smooth'\n  },\n  plotOptions: {\n    bar: {\n      columnWidth: '50%'\n    }\n  },\n  fill: {\n    opacity: [0.85, 0.25, 1],\n    gradient: {\n      inverseColors: false,\n      shade: 'light',\n      type: \"vertical\",\n      opacityFrom: 0.85,\n      opacityTo: 0.55,\n      stops: [0, 100, 100, 100]\n    }\n  },\n  labels: ['01/01/2024', '02/01/2024', '03/01/2024', '04/01/2024', '05/01/2024', '06/01/2024', '07/01/2024', '08/01/2024', '09/01/2024', '10/01/2024', '11/01/2024'],\n  markers: {\n    size: 0\n  },\n  xaxis: {\n    type: 'datetime'\n  },\n  yaxis: {\n    title: {\n      text: 'Income'\n    }\n  },\n  tooltip: {\n    shared: true,\n    intersect: false,\n    y: {\n      formatter: function formatter(y) {\n        if (typeof y !== \"undefined\") {\n          return y.toFixed(0) + \" Income\";\n        }\n        return y;\n      }\n    }\n  }\n};\nvar chart = new ApexCharts(document.querySelector(\"#collectionChart\"), options);\nchart.render();\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/collectionChart.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/collectionChart.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});