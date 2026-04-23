"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _createException = _interopRequireDefault(require("./createException"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var InvalidMiddlewareException = (0, _createException["default"])('InvalidMiddlewareException', {
  message: 'Invalid Middleware'
});
InvalidMiddlewareException.forMiddleware = function (middleware) {
  var message = null;
  if (_lodash["default"].isObject(middleware)) {
    message = "Middleware ".concat(middleware.constructor.name, " is invalid. It must extend from Middleware");
  }
  throw new InvalidMiddlewareException(message);
};
var _default = exports["default"] = InvalidMiddlewareException;