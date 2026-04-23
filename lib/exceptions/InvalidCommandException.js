"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _createException = _interopRequireDefault(require("./createException"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var InvalidCommandException = (0, _createException["default"])('InvalidCommandException', {
  message: 'Invalid Command'
});
InvalidCommandException.forCommand = function (command) {
  var message = null;
  if (_lodash["default"].isObject(command)) {
    message = "Command ".concat(command.constructor.name, " is invalid. It must extend from Command.");
  }
  throw new InvalidCommandException(message);
};
var _default = exports["default"] = InvalidCommandException;