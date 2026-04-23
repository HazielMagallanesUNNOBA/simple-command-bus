"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walkSync = exports.upperFirst = exports.isString = exports.isFunction = exports.isDirectory = exports.capitalize = exports.camelCase = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _capitalize = _interopRequireDefault(require("lodash/capitalize"));
var _camelCase = _interopRequireDefault(require("lodash/camelCase"));
var _upperFirst = _interopRequireDefault(require("lodash/upperFirst"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var isDirectory = exports.isDirectory = function isDirectory(dir) {
  return _fs["default"].lstatSync(dir).isDirectory();
};

// eslint-disable-next-line max-len
var _walkSync = exports.walkSync = function walkSync(file) {
  return isDirectory(file) ? _fs["default"].readdirSync(file).map(function (f) {
    return _walkSync(_path["default"].join(file, f));
  }) : file;
};
var capitalize = exports.capitalize = function capitalize(s) {
  return (0, _capitalize["default"])(s);
};
var camelCase = exports.camelCase = function camelCase(s) {
  return (0, _camelCase["default"])(s);
};
var upperFirst = exports.upperFirst = function upperFirst(s) {
  return (0, _upperFirst["default"])(s);
};
var isString = exports.isString = function isString(s) {
  return typeof s === 'string';
};
var isFunction = exports.isFunction = function isFunction(f) {
  return typeof f === 'function';
};