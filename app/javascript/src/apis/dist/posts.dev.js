"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = void 0;

const _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const fetch = function fetch(params) {
  return _axios["default"].get("/posts", {
    params,
  });
};

const show = function show(slug) {
  return _axios["default"].get("/posts/".concat(slug));
};

const create = function create(payload) {
  return _axios["default"].post("/posts/", {
    post: payload,
  });
};

const update = function update(_ref) {
  const _ref$quiet = _ref.quiet,
    quiet = _ref$quiet === void 0 ? false : _ref$quiet,
    slug = _ref.slug,
    payload = _ref.payload;

  return _axios["default"].put(
    "/posts/".concat(slug).concat(quiet ? "?quiet" : ""),
    {
      post: payload,
    }
  );
};

const destroy = function destroy(_ref2) {
  const slug = _ref2.slug,
    quiet = _ref2.quiet;

  return _axios["default"]["delete"](
    "/posts/".concat(slug).concat(quiet ? "?quiet" : "")
  );
};

const postsApi = {
  fetch,
  show,
  create,
  update,
  destroy,
};
const _default = postsApi;
exports["default"] = _default;
