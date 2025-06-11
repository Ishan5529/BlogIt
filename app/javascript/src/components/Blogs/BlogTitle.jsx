import React from "react";

const BlogTitle = ({ title, slug, showPost }) => (
  <div
    className="cursor-pointer text-2xl font-semibold text-gray-800 hover:text-red-400"
    onClick={() => showPost(slug)}
  >
    {title}
  </div>
);

export default BlogTitle;
