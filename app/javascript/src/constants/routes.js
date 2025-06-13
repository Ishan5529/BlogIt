export const routes = {
  root: "/",
  blogs: {
    // index: "/blogs",
    index: "/",
    create_blog: "/blogs/create",
    show_blog: "/blogs/:slug/show",
    filter_blogs: "/blogs/filter",
  },
  login: "/login",
  signup: "/signup",
  pageNotFound: "/404",
};
