"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _utils = require("../../utils");
var _HandlerLocator2 = _interopRequireDefault(require("./HandlerLocator"));
var _MissingHandlerException = _interopRequireDefault(require("../../exceptions/MissingHandlerException"));
var _InvalidCommandException = _interopRequireDefault(require("../../exceptions/InvalidCommandException"));
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
var NamespaceHandlerLocator = exports["default"] = /*#__PURE__*/function (_HandlerLocator) {
  function NamespaceHandlerLocator(handlersPath) {
    var _this;
    _classCallCheck(this, NamespaceHandlerLocator);
    _this = _callSuper(this, NamespaceHandlerLocator);
    if (!handlersPath || !(0, _utils.isDirectory)(handlersPath)) throw new Error('Invalid commands path.');

    // O(1) lookup map for instant handler retrieval
    _this.handlersMap = new Map();
    var handlerPaths = (0, _utils.walkSync)(handlersPath);

    // Pre-load handlers into memory once during initialization for maximum scalability
    handlerPaths.forEach(function (filePath) {
      // eslint-disable-next-line max-len
      // Targeted disable since dynamic loading is the explicit architectural purpose of this boot sequence
      // eslint-disable-next-line import/no-dynamic-require, global-require
      var HandlerModule = require(filePath);
      var Handler = HandlerModule["default"] || HandlerModule;
      if ((0, _utils.isFunction)(Handler)) {
        // Extracts the exact handler class name (e.g. "CreateUserHandler") from the file path
        var match = filePath.match(/([^/]+)\.js$/);
        if (match) _this.handlersMap.set(match[1], Handler);
      }
    });
    return _this;
  }
  _inherits(NamespaceHandlerLocator, _HandlerLocator);
  return _createClass(NamespaceHandlerLocator, [{
    key: "getHandlerForCommand",
    value: function getHandlerForCommand(commandName) {
      if (!(0, _utils.isString)(commandName)) throw new _InvalidCommandException["default"]();
      var handlerName = commandName.replace('Command', 'Handler');
      var Handler = this.handlersMap.get(handlerName);

      // Ensure the exception actually throws to prevent continuing with an undefined Handler
      if (!Handler) throw _MissingHandlerException["default"].forCommand(commandName);
      return new Handler();
    }
  }]);
}(_HandlerLocator2["default"]);