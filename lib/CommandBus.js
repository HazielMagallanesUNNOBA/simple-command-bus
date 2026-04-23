"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Middleware = _interopRequireDefault(require("./Middleware"));
var _Command = _interopRequireDefault(require("./Command"));
var _InvalidMiddlewareException = _interopRequireDefault(require("./exceptions/InvalidMiddlewareException"));
var _InvalidCommandException = _interopRequireDefault(require("./exceptions/InvalidCommandException"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Intend to define private property
var stack = Symbol('stack');

/**
 * Bus that run and handle commands through middlewares
 */
var CommandBus = exports["default"] = /*#__PURE__*/function () {
  function CommandBus() {
    var middlewares = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    _classCallCheck(this, CommandBus);
    this[stack] = middlewares;
  }
  return _createClass(CommandBus, [{
    key: "getMiddlewareStack",
    value: function getMiddlewareStack() {
      return this[stack];
    }
  }, {
    key: "handle",
    value: function handle(command) {
      if (command instanceof _Command["default"] === false) {
        _InvalidCommandException["default"].forCommand(command);
      }
      var runCommandInMiddlewareStack = this[stack].reduceRight(function (next, middleware) {
        if (middleware instanceof _Middleware["default"] === false) {
          _InvalidMiddlewareException["default"].forMiddleware(middleware);
        }
        return middleware.execute.bind(middleware, command, next);
      }, function () {
        return null;
      });
      var result = runCommandInMiddlewareStack();
      return result;
    }
  }]);
}();