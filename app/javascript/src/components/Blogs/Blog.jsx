import React from "react";

import BlogContent from "components/Blogs/BlogContent";
import BlogDate from "components/Blogs/BlogDate";
import BlogTitle from "components/Blogs/BlogTitle";

const Blog = ({ blog_title, blog_content, blog_date }) => (
  <div className="w-full space-y-4 border-b border-gray-300 pb-2">
    <BlogTitle blog_title={blog_title} />
    <div className="space-y-2">
      <BlogContent blog_content={blog_content} />
      <BlogDate blog_date={blog_date} />
    </div>
  </div>
);

export default Blog;
