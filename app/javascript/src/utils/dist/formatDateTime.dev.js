"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.formatDateTime = void 0;

const formatDateTime = function formatDateTime(datetimeStr) {
  const date = new Date(datetimeStr);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

exports.formatDateTime = formatDateTime;
