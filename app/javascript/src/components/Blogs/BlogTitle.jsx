import React from "react";

const BlogTitle = ({ blog_title, slug, showPost }) => (
  <div
    className="cursor-pointer text-2xl font-semibold text-gray-800 hover:text-red-400"
    onClick={() => showPost(slug)}
  >
    {blog_title}
  </div>
);

export default BlogTitle;
