"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _createException = _interopRequireDefault(require("./createException"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var InvalidHandlerMethodException = (0, _createException["default"])('InvalidHandlerMethodException', {
  message: 'Invalid handler method.'
});
InvalidHandlerMethodException.forMethod = function (method) {
  throw new InvalidHandlerMethodException("Invalid handler method ".concat(method, "."));
};
var _default = exports["default"] = InvalidHandlerMethodException;