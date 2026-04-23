"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _CommandNameExtractor = _interopRequireDefault(require("./CommandNameExtractor/CommandNameExtractor"));
var _MethodNameInflector = _interopRequireDefault(require("./MethodNameInflector/MethodNameInflector"));
var _HandlerLocator = _interopRequireDefault(require("./Locator/HandlerLocator"));
var _Middleware2 = _interopRequireDefault(require("../Middleware"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
// Intend to define private property
var _commandNameExtractor = Symbol('commandNameExtractor');
var _handlerLocator = Symbol('handlerLocator');
var _methodNameInflector = Symbol('methodNameInflector');
var CommandHandlerMiddleware = exports["default"] = /*#__PURE__*/function (_Middleware) {
  function CommandHandlerMiddleware(commandNameExtractor, handlerLocator, methodNameInflector) {
    var _this;
    _classCallCheck(this, CommandHandlerMiddleware);
    _this = _callSuper(this, CommandHandlerMiddleware);
    _this[_commandNameExtractor] = commandNameExtractor;
    _this[_handlerLocator] = handlerLocator;
    _this[_methodNameInflector] = methodNameInflector;
    return _this;
  }
  _inherits(CommandHandlerMiddleware, _Middleware);
  return _createClass(CommandHandlerMiddleware, [{
    key: "commandNameExtractor",
    set: function set(commandNameExtractor) {
      this[_commandNameExtractor] = commandNameExtractor;
    }
  }, {
    key: "handlerLocator",
    set: function set(handlerLocator) {
      this[_handlerLocator] = handlerLocator;
    }
  }, {
    key: "methodNameInflector",
    set: function set(methodNameInflector) {
      this[_methodNameInflector] = methodNameInflector;
    }
  }, {
    key: "execute",
    value: function execute(command, next) {
      var commandName = null;
      var handler = null;
      var methodName = null;
      var result = null;
      if (this[_commandNameExtractor] instanceof _CommandNameExtractor["default"]) {
        commandName = this[_commandNameExtractor].extractName(command);
      }
      if (commandName && this[_handlerLocator] instanceof _HandlerLocator["default"]) {
        handler = this[_handlerLocator].getHandlerForCommand(commandName);
      }
      if (commandName && handler && this[_methodNameInflector] instanceof _MethodNameInflector["default"]) {
        methodName = this[_methodNameInflector].inflect(commandName, handler);
      }
      if (handler && _lodash["default"].isFunction(handler[methodName])) {
        // eslint-disable-next-line no-useless-call
        result = handler[methodName].call(handler, command);
      }
      return result || null;
    }
  }]);
}(_Middleware2["default"]);