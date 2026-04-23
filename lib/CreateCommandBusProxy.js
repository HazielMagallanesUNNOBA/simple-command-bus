"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _utils = require("./utils");
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var cachedCommands = {};
var CreateCommandBusProxy = function CreateCommandBusProxy(commandBus, commandsDir) {
  if (!commandsDir || !(0, _utils.isDirectory)(commandsDir)) {
    throw new Error('Invalid commands path.');
  }
  var availableCommands = (0, _utils.walkSync)(commandsDir);
  return new Proxy({}, {
    get: function get(target, propKey) {
      var commandName = "".concat((0, _utils.upperFirst)((0, _utils.camelCase)(propKey)), "Command.js");
      if (!cachedCommands[commandName]) {
        var foundCommand = availableCommands.find(function (command) {
          return command.endsWith(commandName);
        });
        if (!foundCommand) {
          throw new Error("Command \"".concat(commandName, "\" not found."));
        }
        cachedCommands[commandName] = require(foundCommand); // eslint-disable-line
      }
      var Command = cachedCommands[commandName];
      if ((0, _utils.isFunction)(Command) === false) {
        throw new Error("Command \"".concat(commandName, "\" is not callable."));
      }
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return commandBus.handle(_construct(Command, args));
      };
    }
  });
};
var _default = exports["default"] = CreateCommandBusProxy;