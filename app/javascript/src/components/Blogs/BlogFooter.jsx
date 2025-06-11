import React from "react";

const BlogFooter = ({ date, name }) => (
  <div>
    <div className="text-md font-bold text-gray-600">{name}</div>
    <div className="text-xs font-medium text-gray-400">{date}</div>
  </div>
);

export default BlogFooter;
