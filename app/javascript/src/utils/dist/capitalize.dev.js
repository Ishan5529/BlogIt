"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.capitalize = void 0;

const capitalize = function capitalize(str) {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.capitalize = capitalize;
