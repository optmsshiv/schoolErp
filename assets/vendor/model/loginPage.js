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

/***/ "./model/loginPage.js":
/*!****************************!*\
  !*** ./model/loginPage.js ***!
  \****************************/
/***/ (function() {

eval("// Function to initialize dark mode based on user preference\nfunction initializeDarkMode() {\n  var toggle = document.getElementById('dark-mode-toggle');\n  if (localStorage.getItem('dark-mode') === 'enabled') {\n    document.body.classList.add('dark-mode');\n    toggle.checked = true;\n  } else {\n    document.body.classList.remove('dark-mode');\n    toggle.checked = false;\n  }\n}\n\n// Function to handle the dark mode toggle\nfunction setupDarkModeToggle() {\n  var toggle = document.getElementById('dark-mode-toggle');\n  toggle.addEventListener('change', function () {\n    if (this.checked) {\n      document.body.classList.add('dark-mode');\n      localStorage.setItem('dark-mode', 'enabled');\n    } else {\n      document.body.classList.remove('dark-mode');\n      localStorage.setItem('dark-mode', 'disabled');\n    }\n  });\n}\n\n// Function to toggle password visibility\nfunction setupPasswordToggle() {\n  var passwordInput = document.querySelector('.input-group input[type=\"password\"]');\n  var togglePassword = document.querySelector('.toggle-password');\n  togglePassword.addEventListener('click', function () {\n    if (passwordInput.type === 'password') {\n      passwordInput.type = 'text';\n      togglePassword.textContent = '🙈'; // Change icon to indicate visibility\n    } else {\n      passwordInput.type = 'password';\n      togglePassword.textContent = '👁️'; // Change icon to indicate hidden\n    }\n  });\n}\n\n// Initialize on page load\ndocument.addEventListener('DOMContentLoaded', function () {\n  initializeDarkMode();\n  setupDarkModeToggle();\n  setupPasswordToggle();\n});\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/loginPage.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/loginPage.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});