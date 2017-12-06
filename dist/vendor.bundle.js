(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs"));
	else if(typeof define === 'function' && define.amd)
		define(["rxjs"], factory);
	else if(typeof exports === 'object')
		exports["ngx-chips"] = factory(require("rxjs"));
	else
		root["ngx-chips"] = factory(root["rxjs"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_30__) {
return webpackJsonpngx_chips([0],{

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
__webpack_require__(14);
__webpack_require__(5);
__webpack_require__(15);
__webpack_require__(30);
module.exports = __webpack_require__(6);


/***/ }),

/***/ 30:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_30__;

/***/ })

},[29]);
});
//# sourceMappingURL=vendor.map