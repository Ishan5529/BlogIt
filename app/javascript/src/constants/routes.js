import { USER_ID, USER_NAME } from "constants/user_details";

export const routes = {
  root: "/",
  blogs: {
    // index: "/blogs",
    index: "/",
    create_blog: "/blogs/create",
    edit_blog: "/blogs/:slug/edit",
    show_blog: "/blogs/:slug/show",
    filter_blogs: "/blogs/filter",
    preview_blog: "/blogs/:slug/preview",
    user_blogs: `/blogs/user/${USER_NAME}-${USER_ID}`,
  },
  login: "/login",
  signup: "/signup",
  pageNotFound: "/404",
};
