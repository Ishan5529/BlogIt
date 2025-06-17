"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.routes = void 0;
const routes = {
  root: "/",
  blogs: {
    // index: "/blogs",
    index: "/",
    create_blog: "/blogs/create",
    edit_blog: "/blogs/:slug/edit",
    show_blog: "/blogs/:slug/show",
    filter_blogs: "/blogs/filter",
    preview_blog: "/blogs/:slug/preview",
    user_blogs: "/blogs/user/:userId",
  },
  login: "/login",
  signup: "/signup",
  pageNotFound: "/404",
};
exports.routes = routes;
