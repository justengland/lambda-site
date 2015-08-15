webpackHotUpdate(0,{

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(59), RootInstanceProvider = __webpack_require__(67), ReactMount = __webpack_require__(69), React = __webpack_require__(123); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } (function () {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(123));

	module.exports = React.createClass({
	  displayName: "header",

	  render: function render() {
	    return React.createElement(
	      "h2",
	      null,
	      "Hello Dude Man"
	    );
	  }
	});

	/* REACT HOT LOADER */ }).call(this); if (true) { (function () { module.hot.dispose(function (data) { data.makeHot = module.makeHot; }); if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(227), foundReactClasses = false; if (makeExportsHot(module, __webpack_require__(123))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot not apply hot update to " + "header.jsx" + ": " + err.message); } }); } } })(); }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ }

})