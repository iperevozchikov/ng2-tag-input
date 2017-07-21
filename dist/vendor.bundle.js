(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs"));
	else if(typeof define === 'function' && define.amd)
		define(["rxjs"], factory);
	else if(typeof exports === 'object')
		exports["ng2-tag-input"] = factory(require("rxjs"));
	else
		root["ng2-tag-input"] = factory(root["rxjs"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_25__) {
return webpackJsonpng2_tag_input([0],{

/***/ 25:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_25__;

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
__webpack_require__(7);
__webpack_require__(5);
__webpack_require__(25);
module.exports = __webpack_require__(6);


/***/ })

},[93]);
});
//# sourceMappingURL=vendor.map