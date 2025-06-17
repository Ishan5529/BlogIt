export const routes = {
  root: "/",
  blogs: {
    // index: "/blogs",
    index: "/",
    create_blog: "/blogs/create",
    edit_blog: "/blogs/:slug/edit",
    show_blog: "/blogs/:slug/show",
    filter_blogs: "/blogs/filter",
    user_blogs: "/blogs/user/:userId",
  },
  login: "/login",
  signup: "/signup",
  pageNotFound: "/404",
};
