"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _createException = _interopRequireDefault(require("./createException"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var MissingHandlerException = (0, _createException["default"])('MissingHandlerException', {
  message: 'Invalid Command'
});
MissingHandlerException.forCommand = function (commandName) {
  var message = null;
  if (_lodash["default"].isString(commandName)) {
    message = "There is no a handler for \"".concat(commandName, "\" Command.");
  }
  throw new MissingHandlerException(message);
};
var _default = exports["default"] = MissingHandlerException;