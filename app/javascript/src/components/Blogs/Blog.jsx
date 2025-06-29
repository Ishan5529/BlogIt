import React from "react";

import BlogContent from "components/Blogs/BlogContent";
import BlogFooter from "components/Blogs/BlogFooter";
import BlogTitle from "components/Blogs/BlogTitle";

const Blog = ({
  title,
  categories,
  date,
  slug,
  showPost,
  name,
  isBloggable,
}) => (
  <div className="w-full space-y-4 pb-2">
    <BlogTitle {...{ showPost, slug, title, isBloggable }} />
    <div className="space-y-2">
      <BlogContent {...{ categories }} />
      <BlogFooter {...{ date, name }} />
    </div>
  </div>
);

export default Blog;
