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

/***/ "./model/manageUser.js":
/*!*****************************!*\
  !*** ./model/manageUser.js ***!
  \*****************************/
/***/ (function() {

eval("$(document).ready(function () {\n  // Initialize DataTable with the checkbox column and other configurations\n  var table = $('#optms').DataTable({\n    dom: '<\"row\"<\"col-md-6\"l><\"col-md-6\"B>>' + 't' + '<\"row\"<\"col-md-6\"i><\"col-md-6\"p>>',\n    buttons: [{\n      extend: 'print',\n      text: '<i class=\"fas fa-print\"></i> Print',\n      className: 'btn btn-secondary'\n    }, {\n      extend: 'csv',\n      text: '<i class=\"fas fa-file-csv\"></i> CSV',\n      className: 'btn btn-secondary'\n    }, {\n      extend: 'pdf',\n      text: '<i class=\"fas fa-file-pdf\"></i> PDF',\n      className: 'btn btn-secondary'\n    }, {\n      extend: 'excel',\n      text: '<i class=\"fas fa-file-excel\"></i> Excel',\n      className: 'btn btn-secondary'\n    }, {\n      extend: 'copy',\n      text: '<i class=\"fas fa-copy\"></i> Copy',\n      className: 'btn btn-secondary'\n    }],\n    lengthMenu: [[5, 10, 15, 25, 50, -1], [5, 10, 15, 25, 50, \"All\"]],\n    pagingType: \"full_numbers\",\n    pageLength: 5,\n    language: {\n      paginate: {\n        first: \"<<\",\n        last: \">>\",\n        next: \">\",\n        previous: \"<\"\n      },\n      lengthMenu: \"Display _MENU_ records per page\",\n      info: \"Showing page _PAGE_ of _PAGES_\"\n    },\n    responsive: true,\n    columnDefs: [{\n      orderable: false,\n      targets: 0\n    } // Disable ordering on the checkbox column\n    ]\n  });\n  //search box\n  $('#searchBox').on('keyup', function () {\n    table.search(this.value).draw();\n  });\n\n  // Handle 'Select All' checkbox behavior\n  $('#select-all').on('click', function () {\n    var rows = table.rows({\n      'search': 'applied'\n    }).nodes();\n    $('input[type=\"checkbox\"]', rows).prop('checked', this.checked);\n  });\n\n  // Handle individual row selection\n  $('#example tbody').on('change', 'input[type=\"checkbox\"]', function () {\n    if (!this.checked) {\n      var el = $('#select-all').get(0);\n      if (el && el.checked && 'indeterminate' in el) {\n        el.indeterminate = true;\n      }\n    }\n  });\n  // Event handler for custom length dropdown\n  $('#customLength').on('change', function () {\n    var length = $(this).val();\n    table.page.len(length).draw();\n  });\n});\n\n// Attach click event to custom dropdown export buttons\n$('#printBtn').on('click', function () {\n  table.button('.buttons-print').trigger(); // Trigger print when clicked\n});\n\n// Handle delete button click event\n$('#optms').on('click', '.deleteBtn', function () {\n  var row = $(this).closest('tr'); // Get the closest row (tr) to the delete button\n  var rowData = table.row(row).data(); // Get the row data if needed\n\n  // Optional: Ask for confirmation before deleting\n  var confirmDelete = confirm(\"Are you sure you want to delete this row?\");\n  if (confirmDelete) {\n    // Remove the row from the DataTable\n    table.row(row).remove().draw();\n  }\n});\n\n//# sourceURL=webpack://sneat-bootstrap-html-admin-template-free/./model/manageUser.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./model/manageUser.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});